import { renderHook } from '@testing-library/react-hooks';
import { Policy } from '../types';
import usePermission from '../usePermission';

describe('Permission Check', () => {
  it('should allow authors to update an article.', () => {
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

  it('should deny end-users to delete an article.', () => {
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
