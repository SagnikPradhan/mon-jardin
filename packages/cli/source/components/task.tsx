import React from "react";
import { Box, Spacer, Text } from "ink";
import { useReducer } from "react";

type Symbol = string | JSX.Element;

interface InternalTask {
  id: string;
  priority: number;
  symbol: Symbol;
  type: string;
}

export function useTasks<TaskType extends string>(
  typeMap: {
    [Key in TaskType]: { priority: number; symbol: Symbol };
  }
) {
  const [tasks, dispatchTask] = useReducer(
    (tasks: InternalTask[], [id, type]: [string, TaskType]) => {
      const task: InternalTask = {
        id,
        type,
        ...typeMap[type],
      };

      const updatedTasks = [
        ...tasks.filter((currentTask) => currentTask.id !== task.id),
        task,
      ];

      updatedTasks.sort((a, b) => {
        return a.priority === b.priority ? 0 : a.priority < b.priority ? 1 : -1;
      });

      return updatedTasks;
    },
    []
  );

  return {
    dispatchTask,
    tasks,
  };
}

export function Tasks({ children: tasks }: { children: InternalTask[] }) {
  return (
    <Box flexDirection="column">
      {tasks.map(({ id, symbol, type }) => (
        <Box
          key={id}
          width={55}
          flexDirection="row"
          justifyContent="space-between"
        >
          <Box width={3}>
            {typeof symbol === "string" ? <Text>{symbol}</Text> : symbol}
          </Box>

          <Spacer />

          <Text bold>{type} </Text>
          <Text>{id}</Text>
        </Box>
      ))}
    </Box>
  );
}
