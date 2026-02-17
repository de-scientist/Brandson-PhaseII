export default {
    name: "post",
    title: "Blog Posts",
    type: "document",
    fields: [
      { name: "title", type: "string" },
      {
        name: "slug",
        type: "slug",
        options: { source: "title" },
      },
      { name: "excerpt", type: "text" },
      { name: "coverImage", type: "image" },
      {
        name: "content",
        type: "array",
        of: [{ type: "block" }],
      },
      {
        name: "youtubeVideoId",
        type: "string",
        title: "Optional YouTube Video",
      },
      {
        name: "category",
        type: "string",
      },
      {
        name: "publishedAt",
        type: "datetime",
      },
    ],
  };
  