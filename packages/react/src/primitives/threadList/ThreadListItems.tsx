"use client";

import { ComponentType, FC, memo, useMemo } from "react";
import { ThreadListItemRuntimeProvider } from "../../context/providers/ThreadListItemRuntimeProvider";
import { useAssistantRuntime, useThreadList } from "../../context";

export namespace ThreadListPrimitiveItems {
  export type Props = {
    archived?: boolean | undefined;
    components: {
      ThreadListItem: ComponentType;
    };
  };
}

type ThreadListItemProps = {
  partIndex: number;
  archived: boolean;
  components: ThreadListPrimitiveItems.Props["components"];
};

const ThreadListItemImpl: FC<ThreadListItemProps> = ({
  partIndex,
  archived,
  components,
}) => {
  const assistantRuntime = useAssistantRuntime();
  const runtime = useMemo(
    () =>
      archived
        ? assistantRuntime.threads.getArchivedItemByIndex(partIndex)
        : assistantRuntime.threads.getItemByIndex(partIndex),
    [assistantRuntime, partIndex, archived],
  );

  const ThreadListItemComponent = components.ThreadListItem;

  return (
    <ThreadListItemRuntimeProvider runtime={runtime}>
      <ThreadListItemComponent />
    </ThreadListItemRuntimeProvider>
  );
};

const ThreadListItem = memo(
  ThreadListItemImpl,
  (prev, next) =>
    prev.partIndex === next.partIndex &&
    prev.archived === next.archived &&
    prev.components.ThreadListItem === next.components.ThreadListItem,
);

export const ThreadListPrimitiveItems: FC<ThreadListPrimitiveItems.Props> = ({
  archived = false,
  components,
}) => {
  const contentLength = useThreadList((s) =>
    archived ? s.archivedThreads.length : s.threads.length,
  );

  const listElements = useMemo(() => {
    return Array.from({ length: contentLength }, (_, index) => (
      <ThreadListItem
        key={index}
        partIndex={index}
        archived={archived}
        components={components}
      />
    ));
  }, [contentLength, archived, components]);

  return listElements;
};

ThreadListPrimitiveItems.displayName = "ThreadListPrimitive.Items";
