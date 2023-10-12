export default function (plop) {
    plop.setGenerator('component', {
        description: 'Create a component',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the component?',
            },
            {
                type: 'input',
                name: 'path',
                message: 'What path should this component live under? (src/[your answer here]/. Omit trailing slash.)',
            },
            {
                type: 'confirm',
                name: 'styledComponents',
                message: 'Do you want to add a styled component wrapper?',
            },
            {
                type: 'confirm',
                name: 'testsFolder',
                message: 'Do you want to generate a tests folder?',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/{{path}}/{{camelCase name}}.tsx',
                templateFile: 'templates/component/component.js.hbs',
            },
            {
                type: 'add',
                path: 'src/{{path}}/__tests__/{{camelCase name}}.test.tsx',
                templateFile: 'templates/component/__tests__/component.test.js.hbs',
                skip: (data) => !data.testsFolder,
            },
        ],
    });
    plop.setGenerator('feature', {
        description: 'Create feature base',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the feature?',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/features/{{camelCase name}}/public/{{pascalCase name}}View.tsx',
                templateFile: 'templates/component/component.tsx.hbs',
            },
            {
                type: 'add',
                path: 'src/features/{{camelCase name}}/fence.json',
                templateFile: 'templates/feature/fence.json.hbs',
            },
            {
                type: 'add',
                path: 'src/features/{{camelCase name}}/components',
            },
        ],
    });
}
