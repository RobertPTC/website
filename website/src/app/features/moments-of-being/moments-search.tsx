"use client";

import { useMemo, useState } from "react";

import {
  TextField,
  Popper,
  Box,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import Link from "next/link";

import { MomentOption, Moments, MonthMoment } from "app/api/types";
import TrieFactory, { Trie } from "app/trie";

const sentenceRegex = /[\w\s;\-–,"]+[\?!\.]/gim;
function createMomentSearchTrie(
  moments: [string, MonthMoment][]
): Trie<MomentOption> {
  const momentsTrie: Trie<MomentOption> = TrieFactory();
  moments.forEach(([_, moment]) => {
    moment.moments.all.forEach((v) => {
      v.moment.split(" ").forEach((s) => {
        if (momentsTrie) {
          momentsTrie.addWord(s, {
            label: v.date_string,
            url: `/moments-of-being/moment/${v.id}`,
            momentPreviewText:
              v.moment.match(sentenceRegex)?.slice(0, 2).join(" ") || "",
            id: v.id,
          });
        }
      });
    });
  });
  return momentsTrie;
}
export default function MomentsSearch({ moments }: { moments: Moments }) {
  const [searchOptions, setSearchOptions] = useState<MomentOption[]>([
    { label: "hello world", id: "1", momentPreviewText: "", url: "" },
  ]);
  const [searchAnchorElement, setSearchAnchorElement] =
    useState<HTMLElement | null>(null);
  const momentsSearchTrie = useMemo(() => {
    const entries = Object.entries(moments);
    return createMomentSearchTrie(entries);
  }, [moments]);
  const onClickAway = () => setSearchAnchorElement(null);

  return (
    <>
      <TextField
        fullWidth
        size="small"
        onChange={(e) => {
          let seenMomentIDs: { [key: string]: string } = {};
          const options = momentsSearchTrie
            .findWords(e.currentTarget.value)
            .map((v) => v.data)
            .filter((v) => {
              if (seenMomentIDs[v.id]) return false;
              seenMomentIDs[v.id] = v.id;
              return true;
            });
          setSearchOptions(options);
          if (!searchAnchorElement) {
            setSearchAnchorElement(e.currentTarget);
          }
          if (!options.length) {
            setSearchAnchorElement(null);
          }
        }}
      />
      <ClickAwayListener onClickAway={onClickAway}>
        <Popper
          open={!!searchAnchorElement}
          anchorEl={searchAnchorElement}
          placement="bottom-start"
          disablePortal
        >
          <Box
            sx={{
              border: 1,
              borderColor: "var(--accent)",
              bgcolor: "rgb(var(--background-start-rgb))",
              width: "100%",
              p: 2,
              maxHeight: "200px",
              overflowY: "scroll",
            }}
          >
            {searchOptions.map((o) => {
              return (
                <Box key={o.id} sx={{ mb: 2 }}>
                  <Link href={o.url}>
                    <Typography>{o.label}</Typography>
                  </Link>
                  <Typography sx={{ whiteSpace: "pre-line" }}>
                    {o.momentPreviewText}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Popper>
      </ClickAwayListener>
    </>
  );
}
