"use client";

import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/solid";
import { DiamondsFourIcon } from "@phosphor-icons/react";
import { useState } from "react";

type Node = {
  name: string;
  nodes?: Node[];
};

export const nodes: Node[] = [
  {
    name: "Home",
    nodes: [
      {
        name: "Movies",
        nodes: [
          {
            name: "Action",
            nodes: [
              {
                name: "2000s",
                nodes: [
                  { name: "Gladiator.mp4" },
                  { name: "The-Dark-Knight.mp4" },
                ],
              },
              { name: "2010s", nodes: [] },
            ],
          },
          {
            name: "Comedy",
            nodes: [{ name: "2000s", nodes: [{ name: "Superbad.mp4" }] }],
          },
          {
            name: "Drama",
            nodes: [
              { name: "2000s", nodes: [{ name: "American-Beauty.mp4" }] },
            ],
          },
        ],
      },
      {
        name: "Music",
        nodes: [
          { name: "Rock", nodes: [] },
          { name: "Classical", nodes: [] },
        ],
      },
      { name: "Pictures", nodes: [] },
      {
        name: "Documents",
        nodes: [],
      },
      { name: "passwords.txt" },
    ],
  },
];

function FilesystemItem({ node }: { node: Node }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(node.nodes && node.nodes.length > 0);
  const isFolder = Array.isArray(node.nodes);

  return (
    <li key={node.name}>
      <span className="flex items-center gap-1.5 py-1 text-sm text-gray-200">
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 -m-1"
          >
            <ChevronRightIcon
              className={`size-5 text-gray-500 ${isOpen ? "rotate-90" : ""}`}
            />
          </button>
        )}

        {isFolder ? (
          <DiamondsFourIcon
            weight="fill"
            className={`size-5 text-yellow-500 ${hasChildren ? "" : "ml-5.5"}`}
          />
        ) : (
          <DocumentIcon className="ml-5.5 size-5 text-gray-300" />
        )}
        {node.name}
      </span>

      {isOpen && (
        <ul className="pl-6">
          {node.nodes?.map((node) => (
            <FilesystemItem node={node} key={node.name} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function LayerTree() {
  return (
    <ul className="px-2 py-1">
      {nodes.map((node) => (
        <FilesystemItem node={node} key={node.name} />
      ))}
    </ul>
  );
}
