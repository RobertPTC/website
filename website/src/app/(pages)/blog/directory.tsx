"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

type FileTreeNode = {
  label: string;
  children: FileTreeNode[];
  path: string;
};

const paths = [
  "engineering/website/building-the-google-timer.post",
  "engineering/website/building-the-blog-file-directory.post",
  "engineering/systems/prayer-meeting.post",
];

function buildFileTree(files: string[]) {
  let result: FileTreeNode[] = [];
  files.forEach((element) => {
    let tmp = result;
    element.split("/").forEach((e, idx) => {
      let i = tmp.find((o) => o.label === e);
      if (!i) {
        i = { label: e, children: [], path: e };
        tmp.push(i);
      }
      tmp = i.children;
    });
  });
  return result;
}

function h(root: HTMLElement, node: FileTreeNode) {
  if (typeof window !== "undefined") {
    const label = document.createElement("button");
    if (!node.children.length) {
      label.setAttribute("data-path", node.path);
      label.classList.add("leaf");
      label.innerText = node.label;
      root.append(label);
      return;
    }
    label.innerText = node.label;
    label.classList.add("directory");
    let container = document.createElement("div");
    container.setAttribute("data-directory", node.label);
    root.append(label);
    root.append(container);
    node.children.forEach((c) => {
      h(container, c);
    });
  }
}

function buildDirectoryDOM(graph: FileTreeNode[]) {
  if (typeof window !== "undefined") {
    let rootNode = document.createElement("div");

    graph.forEach((node) => {
      let r = rootNode;
      h(r, node);
    });
    return rootNode;
  }
  return null;
}

export default function Directory() {
  const [fileTreeNode, setFileTreeNode] = useState<HTMLElement | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fileTreeNode = buildDirectoryDOM(buildFileTree(paths));
    setFileTreeNode(fileTreeNode);
  }, []);

  useEffect(() => {
    function directoryOnClick(this: HTMLElement) {
      const sibling = this.nextElementSibling;
      if (sibling) {
        sibling.classList.toggle("directory-closed");
      }
    }
    if (fileTreeNode) {
      const directoryNodes = document.getElementsByClassName("directory");
      Array.from(directoryNodes).forEach((node) => {
        node.addEventListener("click", directoryOnClick);
      });
      return () => {
        Array.from(directoryNodes).forEach((node) => {
          node.removeEventListener("click", directoryOnClick);
        });
      };
    }
  }, [fileTreeNode]);

  useEffect(() => {
    function postOnClick(this: HTMLElement) {
      const post = this.dataset.path;
      if (post) {
        router.push(`/blog/${post}`);
      }
    }
    if (fileTreeNode) {
      const leafNodes = document.getElementsByClassName("leaf");
      Array.from(leafNodes).forEach((node) => {
        node.addEventListener("click", postOnClick);
      });
      return () => {
        Array.from(leafNodes).forEach((node) => {
          node.removeEventListener("click", postOnClick);
        });
      };
    }
  }, [fileTreeNode, router]);

  return (
    <div
      data-blog="root"
      dangerouslySetInnerHTML={{
        __html: fileTreeNode ? fileTreeNode.innerHTML : "",
      }}
    />
  );
}
