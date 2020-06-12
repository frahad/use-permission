import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import { Policy } from '../types';
import usePermission from '../usePermission';

describe('Permission Check', () => {
  it('should allow an author to update its article.', () => {
    const ArticlePolicy = (): Policy => ({
      update: (user, article) => {
        return user.id === article.author.id;
      },
    });

    const { result } = renderHook(() =>
      usePermission(ArticlePolicy(), {
        forUser: {
          id: 1,
          name: 'John Doe',
        },
      }),
    );

    const allows = result.current.allows('update', {
      title: 'First article',
      author: {
        id: 1,
        name: 'John Doe',
      },
    });

    expect(allows).toBe(true);
  });

  it('should deny end-users from deleting an article.', () => {
    const ArticlePolicy = (): Policy => ({
      delete: user => {
        return user.role.slug === 'super-admin';
      },
    });

    const { result } = renderHook(() =>
      usePermission(ArticlePolicy(), {
        forUser: {
          name: 'John Doe',
          role: {
            slug: 'end-user',
          },
        },
      }),
    );

    const denies = result.current.denies('delete', {
      title: 'First article',
      author: {
        id: 1,
        name: 'John Doe',
      },
    });

    expect(denies).toBe(true);
  });
});

describe('Intercept Check', () => {
  it('should allow super-admins or authors to delete an article.', () => {
    const ArticlePolicy = (): Policy => ({
      before: user => {
        return user.role.slug === 'super-admin';
      },

      delete: (user, article) => {
        return user.id === article.author.id;
      },
    });

    const { result } = renderHook(() =>
      usePermission(ArticlePolicy(), {
        forUser: {
          id: 1,
          name: 'John Doe',
          role: {
            slug: 'super-admin',
          },
        },
      }),
    );

    const allows = result.current.allows('delete', {
      title: 'First article',
      author: {
        id: 2,
        name: 'Jane Doe',
      },
    });

    expect(allows).toBe(true);
  });
});

describe('Permission Check through the Permission component', () => {
  it('should display the settings button for the article\'s author.', () => {
    const ArticlePolicy = (): Policy => ({
      update: (user, article) => {
        return user.id === article.author_id;
      },

      delete: (user, article) => {
        return user.id === article.author_id;
      },
    });

    const { result } = renderHook(() =>
      usePermission(ArticlePolicy(), {
        forUser: {
          id: 1,
          name: 'John Doe',
        },
      }),
    );

    const article = {
      title: 'My First Article',
      body: 'Lorem ipsum dolor sit amet, consectetur...',
      author_id: 1,
    };

    const { Permission } = result.current;
    const { container } = render(
      <Permission allows={['update', 'delete']} on={article}>
        <button>Settings</button>
      </Permission>,
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <button>
        Settings
      </button>
    `);
  });
});
