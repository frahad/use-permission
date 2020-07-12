<p align="center">
  <h1 align="center">usePermission</h1>
</p>

<p align="center">
  A React hook that provides a simple, declarative and scalable way for you to manage permissions within your React application.
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

- [Usage](#-usage)
  - [Authorization logic](#authorization-logic)
    - [Writing Policies](#writing-policies)
  - [Authorizing Actions](#authorizing-actions)
    - [Permission component](#permission-)
  - [Intercepting Checks](#intercepting-checks)
- [License](#-license)

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

Seems fine, right? The problem is, as your application grows and you have to add more complex conditions to render the button, your code becomes hard to maintain. Take a look at this real world example of a React Native delivery app:

```jsx
function Delivery() {
  // ...

  return (
    <View>
      ...

      {user.type === 'delivery-driver' &&
        user.id === delivery.driver.id &&
        delivery.status &&
        delivery.status.slug === 'collected' && (
        <Button onPress={sendNotification}>
          Send notification
        </Button>
      )}
    </View>
  );
}
```

In the given example, we're conditionally rendering a notification button if the authenticated user is the driver who collected the package, this is because the driver can notify the recipient about the order's arrival. But there are two problems, besides we are polluting the component with all these conditions, we were also unable to reuse the authorization logic in other parts of our application.

By abstracting the authorization logic, you avoid code duplication and allow your application to scale in a much better way. This is where `policies` come into play!

#### Writing Policies

Basically, Policies are functions that organize authorization logic around a particular resource.

Now, back to the articles, let's rewrite the first example by creating an `ArticlePolicy` and then use the methods provided by the `usePermission` hook to check if the user is allowed to update the article.

```js
function ArticlePolicy() {
  return {
    update: (user, article) => {
      return (
        user.role.slug === 'super-admin' ||
        user.id === article.author.id
      );
    },

    // ...
  };
}
```

> Note that each method within your policy represents an action that the user can perform (e.g., `index`, `create`, `view`, `update`, `delete`).

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

Take a look at how simple and declarative your code became, and how you're able to reuse the authorization logic in other parts of your application!

#### `<Permission />`

Note that the `usePermission` also provides a `Permission` component that allows you to conditionally render a child component:

```jsx
// ...

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

##### Props

| Name     | Type                   | Description                                                                      |
| -------- | ---------------------- | -------------------------------------------------------------------------------- |
| `allows` | `string` or `string[]` | The actions that, if allowed to the user, will cause the rendering of the child. |
| `denies` | `string` or `string[]` | The actions that, if denied to the user, will cause the rendering of the child.  |
| `on`     | `object`               | Defines the resource to authorize.                                               |

### Intercepting Checks

Sometimes, you may wish to authorize all actions within a given policy to a given user. To accomplish this, you may define a `before` method within the policy:

```js
function ArticlePolicy() {
  return {
    before: user => {
      return user.type.slug === 'super-admin';
    },

    update: (user, article) => {
      return user.id === article.author.id;
    },

    // ...
  };
}
```

When defined, the `before` method is called before all other authorization checks considering only truthy values, which means that, if your implementation of `before` evaluates to a falsey value, then `usePermission` will proceed with the authorization checking for the given action.

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
