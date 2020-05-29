<p align="center">
  <h1 align="center">usePermission</h1>
</p>

<p align="center">
  A React hook that provides a simple, expressive and scalable way for you to manage permissions within your React application.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="usePermission is released under the MIT license." />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  <img src="https://img.shields.io/badge/Dependabot-active-brightgreen.svg" alt="Dependabot active.">
</p>

<div align="center">
  <pre>yarn add use-permission</pre>
</div>

<br />

## Contents

- [Usage](#usage)
  - [Authorization logic](#authorization-logic)
    - [Writing Policies](#writing-policies)
  - [Authorizing Actions](#authorizing-actions)
- [License](#license)

## 🚀 Usage

### Authorization logic

Suppose you have a list of articles, and you want to conditionally render an `update` button for the article's author, you would probably do something like:

```jsx
// ...

return (
  <div>
    {articles.map(article => (
      <li>
        {article.title} by {article.author}

        {article.author.id === user.id && (
          <button>Update</button>
        )}
      </li>
    ))}
  </div>
);
```

Seems fine, right? The problem is, as your application grows and you have to add more complex conditions to render the button, your code becomes hard to maintain. This is where `policies` come into play!

#### Writing Policies

Basically, Policies are functions that organize authorization logic around a particular resource.

Now, let's rewrite the previous example by creating an `ArticlePolicy` and then use the methods provided by the `usePermission` hook to check if the user is allowed to update the article.

```js
function ArticlePolicy() {
  return {
    update: (user, article) => {
      return user.id === article.author.id;
    },

    // ...
  };
}
```

Note that you can define the authorization logic for any actions your user can perform, such as `index`, `create`, `view`, `update`, `delete`, etc.

### Authorizing Actions

The `usePermission` takes two arguments, the first is the `policy` that contains the authorization logic, and the second **(optional)** is the `init`, an object that may have the following properties:

- `forUser`: defines the user that will be passed as parameter for each action in your policy.

To authorize an action, you may use the `allows` and `denies` methods provided by the `usePermission` hook, both accept the same arguments: the action (or a list of actions) to authorize, and **(optionally)** the resource to authorize.

```jsx
import usePermission from 'use-permission';
import ArticlePolicy from './policies/ArticlePolicy';

function App() {
  // ...

  const permission = usePermission(ArticlePolicy(), {
    forUser: {
      id: 1,
      name: 'John Doe',
      email: 'example@domain.com'
    }
  });

  return (
    <div>
      {articles.map(article => (
        <li>
          {article.title} by {article.author}

          {permission.allows('update', article) && (
            <button>Update</button>
          )}
        </li>
      ))}
    </div>
  );
}
```

The `usePermission` also provides a `Permission` component that allows you to conditionally render a child component in a react style:

```jsx
...

const { Permission } = usePermission(ArticlePolicy(), {
  forUser: {
    id: 1,
    name: 'John Doe',
    email: 'example@domain.com'
  }
});

return (
  <div>
    {articles.map(article => (
      <li>
        {article.title} by {article.author}

        <Permission allows="update" on={article}>
          <button>Update</button>
        </Permission>
      </li>
    ))}
  </div>
);
```

#### `<Permission />`

| Prop     | Type                   | Description                                                                      |
| -------- | ---------------------- | -------------------------------------------------------------------------------- |
| `allows` | `string` or `string[]` | The actions that, if allowed to the user, will cause the rendering of the child. |
| `denies` | `string` or `string[]` | The actions that, if denied to the user, will cause the rendering of the child.  |
| `on`     | `object`               | Defines the resource used by the action.                                         |

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
