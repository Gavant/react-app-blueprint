export default function (plop) {
    plop.setGenerator('component', {
        actions: [
            {
                path: 'src/{{path}}/{{camelCase name}}.tsx',
                templateFile: 'templates/component/component.js.hbs',
                type: 'add',
            },
            {
                path: 'src/{{path}}/__tests__/{{camelCase name}}.test.tsx',
                skip: (data) => !data.testsFolder,
                templateFile: 'templates/component/__tests__/component.test.js.hbs',
                type: 'add',
            },
        ],
        description: 'Create a component',
        prompts: [
            {
                message: 'What is the name of the component?',
                name: 'name',
                type: 'input',
            },
            {
                message: 'What path should this component live under? (src/[your answer here]/. Omit trailing slash.)',
                name: 'path',
                type: 'input',
            },
            {
                message: 'Do you want to add a styled component wrapper?',
                name: 'styledComponents',
                type: 'confirm',
            },
            {
                message: 'Do you want to generate a tests folder?',
                name: 'testsFolder',
                type: 'confirm',
            },
        ],
    });
    plop.setGenerator('feature', {
        actions: [
            {
                path: 'src/features/{{camelCase name}}/public/{{pascalCase name}}View.tsx',
                templateFile: 'templates/component/component.tsx.hbs',
                type: 'add',
            },
            {
                path: 'src/features/{{camelCase name}}/fence.json',
                templateFile: 'templates/feature/fence.json.hbs',
                type: 'add',
            },
            {
                path: 'src/features/{{camelCase name}}/components',
                type: 'add',
            },
        ],
        description: 'Create feature base',
        prompts: [
            {
                message: 'What is the name of the feature?',
                name: 'name',
                type: 'input',
            },
        ],
    });
}
