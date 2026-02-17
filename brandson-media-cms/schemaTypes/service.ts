export default {
    name: "service",
    title: "Services",
    type: "document",
    fields: [
      { name: "title", type: "string", title: "Service Name" },
      {
        name: "slug",
        type: "slug",
        options: { source: "title" },
      },
      {
        name: "category",
        type: "string",
        options: {
          list: [
            "Printing",
            "Branding",
            "Signage",
            "Embroidery",
            "UV Printing",
            "LED Billboards",
          ],
        },
      },
      { name: "excerpt", type: "text", title: "Short Description" },
      { name: "description", type: "array", of: [{ type: "block" }] },
      {
        name: "images",
        type: "array",
        of: [{ type: "image" }],
      },
      {
        name: "youtubeVideoId",
        type: "string",
        title: "YouTube Video ID",
      },
      {
        name: "featured",
        type: "boolean",
        title: "Featured on Homepage",
      },
    ],
  };
  