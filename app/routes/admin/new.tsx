import { useTransition, useActionData, redirect } from 'remix';
import type { ActionFunction } from 'remix';
import invariant from 'tiny-invariant';
import { Transition } from '@remix-run/react/transition';
import { createPost } from '~/post';
import FileForm from '~/components/FileForm';

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();

  const title = formData.get('title');
  const slug = formData.get('slug');
  const markdown = formData.get('markdown');

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === 'string');
  invariant(typeof slug === 'string');
  invariant(typeof markdown === 'string');
  await createPost({ title, slug, markdown });

  return redirect('/admin');
};

export default function NewPost() {
  const errors: any = useActionData();
  const transition: Transition = useTransition();
  return <FileForm errors={errors} transition={transition} />;
}
