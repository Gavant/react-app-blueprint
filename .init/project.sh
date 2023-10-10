current_dir=basename $(pwd)
LC_ALL=C find . -type f -exec sed -i '' s/{{APP_NAME}}/${current_dir}/g {} +
# TODO (maybe?) replace README.md content w/project specific info
yarn install
git init

