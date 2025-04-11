import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PlotlyChart } from "./PlotlyChart";
import { GraphDBTable } from "./GraphDBTable";
import { ProductsResult } from "./ProductsResult";
import { ToolMessage, AIMessage } from "@langchain/langgraph-sdk";

function isComplexValue(value: any): boolean {
  return Array.isArray(value) || (typeof value === "object" && value !== null);
}

export function ToolCalls({
  toolCalls,
}: {
  toolCalls: AIMessage["tool_calls"];
}) {
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="space-y-4 w-full max-w-4xl">
      {toolCalls.map((tc, idx) => {
        const args = tc.args as Record<string, any>;
        const hasArgs = Object.keys(args).length > 0;
        return (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">
                {tc.name}
                {tc.id && (
                  <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded max-w-[100px] sm:max-w-[150px] md:max-w-[200px] truncate inline-block align-middle">
                    {tc.id}
                  </code>
                )}
              </h3>
            </div>
            {hasArgs ? (
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(args).map(([key, value], argIdx) => (
                    <tr key={argIdx}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {key}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 break-all">
                        {isComplexValue(value) ? (
                          <code className="bg-gray-50 rounded px-2 py-1 font-mono text-sm">
                            {JSON.stringify(value, null, 2)}
                          </code>
                        ) : (
                          String(value)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <code className="text-sm block p-3">{"{}"}</code>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Reusable toggle button component
function ToggleButton({ isExpanded, onClick }: { isExpanded: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full py-2 flex items-center justify-center border-t-[1px] border-gray-200 text-gray-500 hover:text-gray-600 hover:bg-gray-50 transition-all ease-in-out duration-200 cursor-pointer"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isExpanded ? (
        <>
          <ChevronUp className="w-4 h-4 mr-1" />
          <span>Show less</span>
        </>
      ) : (
        <>
          <ChevronDown className="w-4 h-4 mr-1" />
          <span>Show more</span>
        </>
      )}
    </motion.button>
  );
}

function ToolCallHeader({ title, tool_call_id, show_call_id }: { title: string, tool_call_id: string, show_call_id: boolean }) {
  return (
    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-medium text-gray-900">
          {title}
          {(tool_call_id && show_call_id) && (
            <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded max-w-[100px] sm:max-w-[150px] md:max-w-[200px] truncate inline-block align-middle">
              {tool_call_id}
            </code>
          )}
        </h3>
      </div>
    </div>
  );
}

export function ToolResult({ message, show_call_id = true }: { message: ToolMessage, show_call_id: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle different tool message types
  const isChart = message.name === 'chart' && message.artifact;
  const isGraphDB = message.name === 'graphdb' && message.artifact;
  const isProducts = message.name === 'products';

  // Toggle expansion state
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // If it's a chart, render the Plotly component with collapsible behavior
  if (isChart) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <ToolCallHeader title={"Chart"} tool_call_id={message.tool_call_id} show_call_id={show_call_id} />

        <div className="p-4">
          {/* Use a container with masking in preview mode */}
          <div
            className="w-full relative transition-all duration-300"
            style={{
              maxHeight: isExpanded ? '2000px' : '250px',
              overflow: isExpanded ? 'visible' : 'hidden'
            }}
          >
            <PlotlyChart data={message.artifact} />

            {/* Gradient overlay only when in preview mode */}
            {!isExpanded && (
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>

        <ToggleButton isExpanded={isExpanded} onClick={toggleExpansion} />
      </div>
    );
  }

  // If it's a GraphDB result, render the GraphDBTable component with collapsible behavior
  if (isGraphDB) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
        <ToolCallHeader title={"Database Result"} tool_call_id={message.tool_call_id} show_call_id={show_call_id} />

        <div className="relative">
          <div className={`p-4 ${!isExpanded ? "max-h-[200px] overflow-hidden" : ""}`}>
            <GraphDBTable data={message.artifact} />

            {/* Gradient overlay when collapsed */}
            {!isExpanded && (
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>

          <ToggleButton isExpanded={isExpanded} onClick={toggleExpansion} />
        </div>
      </div>
    );
  }

  // If it's a products result, render the ProductsResult component
  if (isProducts) {
    try {

      if (!Array.isArray(message.artifact)) {
        throw new Error("Products data must be an array");
      }

      const products = typeof message.artifact === 'string' ? message.artifact.map((jsonString: string) => JSON.parse(jsonString)) : message.artifact;

      return (
        <div className="border border-gray-200 rounded-lg overflow-hidden w-full max-w-full flex-grow">
          <ToolCallHeader title={"Product Result"} tool_call_id={message.tool_call_id} show_call_id={show_call_id} />

          <div className="p-4">
            <ProductsResult data={products} />
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error parsing products data:", error);
      // Fall back to standard rendering if parsing fails
    }
  }

  // Standard tool result rendering
  let parsedContent: any;
  let isJsonContent = false;

  try {
    if (typeof message.content === 'string') {
      parsedContent = JSON.parse(message.content);
      isJsonContent = true;
    }
  } catch {
    // Content is not JSON, use as is
    parsedContent = message.content;
  }

  const contentStr = isJsonContent
    ? JSON.stringify(parsedContent, null, 2)
    : String(message.content);
  const contentLines = contentStr.split("\n");
  const shouldTruncate = contentLines.length > 4 || contentStr.length > 500;
  const displayedContent =
    shouldTruncate && !isExpanded
      ? contentStr.length > 500
        ? contentStr.slice(0, 500) + "..."
        : contentLines.slice(0, 4).join("\n") + "\n..."
      : contentStr;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <ToolCallHeader title={message.name ? "Tool Result: " + message.name : "Tool Result"} tool_call_id={message.tool_call_id} show_call_id={show_call_id} />

      <div className="min-w-full bg-gray-100">
        <div className="p-3 relative">
          <div className={!isExpanded && shouldTruncate ? "relative" : ""}>
            {isJsonContent ? (
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(parsedContent)
                    ? isExpanded
                      ? parsedContent
                      : parsedContent.slice(0, 5)
                    : Object.entries(parsedContent)
                  ).map((item, argIdx) => {
                    const [key, value] = Array.isArray(parsedContent)
                      ? [argIdx, item]
                      : [item[0], item[1]];
                    return (
                      <tr key={argIdx}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {key}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {isComplexValue(value) ? (
                            <code className="bg-gray-50 rounded px-2 py-1 font-mono text-sm break-all">
                              {JSON.stringify(value, null, 2)}
                            </code>
                          ) : (
                            String(value)
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <code className="text-sm block">{displayedContent}</code>
            )}
          </div>
        </div>

        {((shouldTruncate && !isJsonContent) ||
          (isJsonContent &&
            Array.isArray(parsedContent) &&
            parsedContent.length > 5)) && (
            <ToggleButton isExpanded={isExpanded} onClick={toggleExpansion} />
          )}
      </div>
    </div>
  );
}
