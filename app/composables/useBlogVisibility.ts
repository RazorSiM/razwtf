// Whether blog surfaces (nav link, footer link, home "Notes" section) should
// show at all - derived from the published (non-draft) post count rather than
// hardcoded, so they gracefully disappear if the blog is ever emptied out and
// reappear the moment a post is published again (raz-je5). `.count()` keeps
// the query/payload tiny - just an integer, not the posts themselves.
export async function useHasPublishedPosts() {
  const { data } = await useAsyncData('published-posts-count', () =>
    queryCollection('posts').where('draft', '=', false).count())

  return computed(() => (data.value ?? 0) > 0)
}
