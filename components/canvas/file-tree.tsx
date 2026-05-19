// filesystem-item-animated.tsx
"use client";

import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/solid";
import { DiamondsFourIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Node = {
  name: string;
  nodes?: Node[];
};

const nodes: Node[] = [
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

// FileTree renders the root list
export default function FileTreeRoot() {
  return (
    <ul className="select-none flex-1">
      {nodes.map((node) => (
        <FileTreeNode node={node} key={node.name} />
      ))}
    </ul>
  );
}

// FileTreeNode renders a single node (file or folder)
function FileTreeNode({ node }: { node: Node }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={node.name}>
      <span className="flex items-center gap-1.5 py-1">
        {node.nodes && node.nodes.length > 0 && (
          <button onClick={() => setIsOpen((v) => !v)} className="p-1 -m-1">
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.1 }}
              className="flex"
            >
              <ChevronRightIcon className="size-4 text-gray-500" />
            </motion.span>
          </button>
        )}
        {node.nodes ? (
          <DiamondsFourIcon
            weight="fill"
            className={`size-5 text-orange-500 ${
              node.nodes.length === 0 ? "ml-[22px]" : ""
            }`}
          />
        ) : (
          <DocumentIcon className="ml-[22px] size-5 text-gray-900" />
        )}
        {node.name}
      </span>

      <AnimatePresence>
        {isOpen && node.nodes && node.nodes.length > 0 && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{
              height: "auto",
            }}
            exit={{ height: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.1 }}
            className="pl-6 overflow-hidden flex flex-col justify-end"
          >
            {node.nodes.map((child) => (
              <FileTreeNode node={child} key={child.name} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
