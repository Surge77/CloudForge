import type {
  TemplateFile,
  TemplateFolder,
  TemplateItem,
} from "@/features/playground/libs/path-to-json";

interface WebContainerFile {
  file: {
    contents: string;
  };
}

interface WebContainerDirectory {
  directory: {
    [key: string]: WebContainerFile | WebContainerDirectory;
  };
}

type WebContainerFileSystem = Record<
  string,
  WebContainerFile | WebContainerDirectory
>;

const isFolder = (item: TemplateItem): item is TemplateFolder => {
  return "folderName" in item;
};

const getItemName = (item: TemplateItem): string => {
  if (isFolder(item)) {
    return item.folderName;
  }

  return item.fileExtension
    ? `${item.filename}.${item.fileExtension}`
    : item.filename;
};

export function transformToWebContainerFormat(
  template: TemplateFolder
): WebContainerFileSystem {
  function processFile(item: TemplateFile): WebContainerFile {
    return {
      file: {
        contents: item.content,
      },
    };
  }

  function processFolder(item: TemplateFolder): WebContainerDirectory {
    const directory: WebContainerFileSystem = {};

    item.items.forEach((subItem) => {
      directory[getItemName(subItem)] = processItem(subItem);
    });

    return { directory };
  }

  function processItem(
    item: TemplateItem
  ): WebContainerFile | WebContainerDirectory {
    return isFolder(item) ? processFolder(item) : processFile(item);
  }

  const result: WebContainerFileSystem = {};

  template.items.forEach((item) => {
    result[getItemName(item)] = processItem(item);
  });

  return result;
}
