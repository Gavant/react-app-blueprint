#!/bin/bash

#Requirements:
#	AWS Cli
#	Serverless
#	jq
#	python3.8-dev

function SetAwsProfile()
{
	aws configure set aws_access_key_id $AwsAccessKey --profile $SvcName-$AwsStage
	aws configure set aws_secret_access_key $AwsSecretKey --profile $SvcName-$AwsStage
	aws configure set region $AwsRegion --profile $SvcName-$AwsStage
}

function GetStageFromBranchName () #Parameters: BranchName
{
	echo $1 | sed -e 's/.*\///' -e "s/-.*//"
}

function TrimUrlToDomain() #Parameters: Url
{
	echo $1 | sed -e "s/.*\/\///" -e "s/\/.*//"
}

function AwsEncrypt () #Parameters: TargetString, KmsKey
{
	echo $(aws kms encrypt --key-id $2 --plaintext "$1" --output text --query CiphertextBlob --region $AwsRegion)
}

function GetGatewayUrl () #Parameters: Platform ("api" or "fastboot")
{
	stage_name=$Branch
    aws apigateway get-rest-apis --region $AwsRegion --output json > gateways.json
	gateway=$( cat gateways.json | jq -r --arg ApiName "$stage_name" --arg Platform "$1" '.items[] | select(.name | startswith($ApiName) and endswith($Platform) ) | .id' )

	#Fall back to master if we don't find a matching api for this branch
	if [ -z $gateway ]; then
		stage_name="master"
		gateway=$( cat gateways.json | jq -r --arg ApiName "$stage_name" --arg Platform "$1" '.items[] | select(.name | startswith($ApiName) and endswith($Platform) ) | .id' )
	fi

	#If we found an api, append the rest of the url
	if [ -n $gateway ]; then
		gateway=$(echo $gateway | sed "s/\"//g").execute-api.$AwsRegion.amazonaws.com/$stage_name
	fi

	rm gateways.json
	echo $gateway
}

function GetWebsocketUrl () #Parameters: None
{
	stage_name=$Branch
	websocket_url=$( aws apigatewayv2 get-apis --region $AwsRegion | jq -r --arg ApiStage "$stage_name" '.Items[] | select(.Name | endswith($ApiStage) ) | select(.ProtocolType | startswith("WEBSOCKET")) | .ApiEndpoint' )

	#Fall back to master if we don't find a matching api for this branch
	if [ -z $websocket_url ]; then
		stage_name="master"
		websocket_url=$( aws apigatewayv2 get-apis --region $AwsRegion | jq -r --arg ApiName "$stage_name" --arg Platform "WEBSOCKET" '.Items[] | select(.Name | endswith($ApiName) ) | select(.ProtocolType | startswith($Platform)) | .ApiEndpoint' )
	fi

	#If we found a url, append the stage onto it
	if [ -n $websocket_url ]; then
		websocket_url=$(echo $websocket_url/$stage_name)
	fi

	echo $websocket_url
}

function DockerBuildAndPackage()
{
	ImageName="$SvcName-api"
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $DockerRepoUrl && \
	aws ecr describe-repositories --repository-names "$ImageName" || aws ecr create-repository --repository-name "$ImageName" && \
	DOCKER_BUILDKIT=1 docker build --no-cache --ssh gitlab_ssh_key=/home/gitlab-runner/.ssh/gitlab_deploy_key -t "$ImageName":$CI_PIPELINE_ID . && \
	docker tag "$ImageName":$CI_PIPELINE_ID $DockerRepoUrl/"$ImageName":$CI_PIPELINE_ID  && \
	docker push $DockerRepoUrl/"$ImageName":$CI_PIPELINE_ID
}

function DockerCleanup()
{
	ImageName="$SvcName-api"
	docker rmi "$ImageName:$CI_PIPELINE_ID"
	docker rmi "$DockerRepoUrl/$ImageName:$CI_PIPELINE_ID"
	docker system prune --all --volumes --force
}

function CreatePublicBucket() #Parameters: BucketName
{
	aws s3 ls s3://$1 || aws s3 mb s3://$1 --region $AwsRegion
    aws s3api put-bucket-acl --bucket $1 --acl public-read
}

function CopyToBucket() #Paramters: FolderName, DestinationBucketPath
{
	aws s3 cp $1 s3://$2 --recursive --acl public-read
}

function DeleteBucketFolder() #Parameters: BucketPath
{
	aws s3 rm s3://$1 --recursive
}

"$@"