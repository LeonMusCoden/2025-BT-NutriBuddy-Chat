import { validate } from "uuid";
import { getApiKey } from "@/lib/api-key";
import { Thread } from "@langchain/langgraph-sdk";
import { useQueryState } from "nuqs";
import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from "react";
import { createClient } from "./client";
import { useAuth } from "./Auth";

interface ThreadContextType {
  getThreads: () => Promise<Thread[]>;
  threads: Thread[];
  setThreads: Dispatch<SetStateAction<Thread[]>>;
  threadsLoading: boolean;
  setThreadsLoading: Dispatch<SetStateAction<boolean>>;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

const envApiUrl: string | undefined = import.meta.env.VITE_API_URL;
const envAssistantId: string | undefined = import.meta.env.VITE_ASSISTANT_ID;

function getThreadSearchMetadata(
  assistantId: string,
): { graph_id: string } | { assistant_id: string } {
  if (validate(assistantId)) {
    return { assistant_id: assistantId };
  } else {
    return { graph_id: assistantId };
  }
}

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [apiUrlParam] = useQueryState("apiUrl");
  const [assistantIdParam] = useQueryState("assistantId");
  const [effectiveApiUrl, setEffectiveApiUrl] = useState(apiUrlParam || envApiUrl || "");
  const [effectiveAssistantId, setEffectiveAssistantId] = useState(assistantIdParam || envAssistantId || "");
  // Update effective values if URL params change
  useEffect(() => {
    setEffectiveApiUrl(apiUrlParam || envApiUrl || "");
  }, [apiUrlParam]);

  useEffect(() => {
    setEffectiveAssistantId(assistantIdParam || envAssistantId || "");
  }, [assistantIdParam]);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const { user } = useAuth();

  const getThreads = useCallback(async (): Promise<Thread[]> => {
    if (!effectiveApiUrl || !effectiveAssistantId) {
      return [];
    }
    const client = createClient(effectiveApiUrl, getApiKey() ?? undefined);

    const threads = await client.threads.search({
      metadata: {
        user: user?.token,
        ...getThreadSearchMetadata(effectiveAssistantId),
      },
      limit: 100,
    });

    return threads;
  }, [effectiveApiUrl, effectiveAssistantId, user]);

  const value = {
    getThreads,
    threads,
    setThreads,
    threadsLoading,
    setThreadsLoading,
  };

  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  );
}

export function useThreads() {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
}
