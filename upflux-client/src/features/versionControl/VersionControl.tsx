import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  Text,
  Select,
  Modal,
  SimpleGrid,
  Indicator
} from "@mantine/core";
import "./versionControl.css";
import ReactSpeedometer, { Transition } from "react-d3-speedometer";
import { useSelector } from "react-redux";
import { RootState } from "../reduxSubscription/store";
import { IApplications } from "../reduxSubscription/applicationVersions";

export const VersionControl: React.FC = () => {
  //Machine list from redux 
  const storedMachines = useSelector((root: RootState) => root.machines.messages)
  const cpuColors = [
    "#00FF00", // Green
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#33FF00",
    "#FFFF00", // Yellow 
    "#FFFF00",
    "#FF0000",
    "#FF0000", // Red 
  ];

  const tempColors = [
    "#00FF00", // Green
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#33FF00",
    "#FFFF00", // Yellow 
    "#FFFF00",
    "#FF0000",
    "#FF0000", // Red 
  ];

  const memoryColors = [
    "#00FF00", // Green
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#33FF00",
    "#FFFF00",
    "#FFFF00", // Yellow 
    "#FFFF00",
    "#FF0000", // Red 
  ];

  const diskColors = [
    "#00FF00", // Green
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#00FF00",
    "#33FF00",
    "#FFFF00", // Yellow 
    "#FFFF00",
    "#FF0000",
    "#FF0000", // Red 
  ];

  // State for Modal visibility
  const [modalOpened, setModalOpened] = useState(false);
  const applications: Record<string, IApplications> = useSelector((state: RootState) => state.applications.messages)
  const machineMetrics = useSelector(
    (state: RootState) => state.metrics.metrics
  );

  const [selectedMachineName, setSelectedMachineName] = useState("")
  const [selectedMachineId, setSelectedMachineId] = useState("")

  const findMachineIdByName = (name) => {
    return Object.entries(storedMachines).find(([, machine]) => machine.machineName === name)?.[0] || "";
  };

  useEffect(() => {
    setSelectedMachineId(findMachineIdByName(selectedMachineName))
  }, [selectedMachineName])


  // State for app versions and loading status
  const [appVersions, setAppVersions] = useState<
    { appName: string; appVersion: string; lastUpdate: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  // Mocked machine metrics data
  const metrics = [
    {
      label: "CPU (%)",
      value: parseInt(machineMetrics[selectedMachineId]?.metrics.cpuUsage.toFixed()) || 0,
    },
    {
      label: "CPU Temp (°C)",
      value: parseInt(
        machineMetrics[selectedMachineId]?.metrics.cpuTemperature.toFixed()
      ) || 0,
    },
    {
      label: "Memory Usage (%)",
      value: parseInt(machineMetrics[selectedMachineId]?.metrics.memoryUsage.toFixed()) || 0,
    },
    {
      label: "Disk Usage (%)",
      value: parseInt(machineMetrics[selectedMachineId]?.metrics.diskUsage.toFixed()) || 0,
    },
  ];

  // Determine the color based on the metric value
  const getColor = (value: number) => {
    if (value <= 50) return "green";
    if (value > 50 && value <= 80) return "orange";
    return "red";
  };

  return (
    <Stack className="version-control-content">

      <Box className="content-wrapper">
        <Box className="machine-id-box">
          {selectedMachineName && (
            <Indicator
              inline
              color={storedMachines[selectedMachineId]?.isOnline ? "green" : "red"}
              label={storedMachines[selectedMachineId]?.isOnline ? "Online" : "Offline"}
              size={16}
            >
              <Select
                data={Object.values(storedMachines).map(m => m.machineName)}
                value={selectedMachineName}
                onChange={(value) => setSelectedMachineName(value)}
                placeholder="Select Machine"
              />
            </Indicator>
          )}

          {!selectedMachineName && (
            <Select
              data={Object.values(storedMachines).map(m => m.machineName)}
              value={selectedMachineName}
              onChange={(value) => setSelectedMachineName(value)}
              placeholder="Select Machine"
            />
          )}
        </Box>

        {/* Machine Metrics Section */}
        <Box className="metrics-container">
          <SimpleGrid cols={4}>
            {metrics.map((metric, index) => (
              <Box key={index} style={{ textAlign: "center" }}>
                <ReactSpeedometer
                  key={index}
                  minValue={0}
                  maxValue={100}
                  segments={cpuColors.length}
                  segmentColors={
                    index % 4 === 0
                      ? cpuColors
                      : index % 4 === 1
                        ? tempColors
                        : index % 4 === 2
                          ? memoryColors
                          : diskColors
                  }
                  value={metric.value}
                  needleColor="black"
                  width={250}
                  height={150}
                  ringWidth={30}
                  maxSegmentLabels={4}
                />
                <Text className="metrics-labels" size="sm" fw="bold" mt="sm">
                  {metric.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
          <center>
            <h2 style={{ textAlign: "center" }}>
              System Uptime: {formatUptime(machineMetrics[selectedMachineId]?.metrics.systemUptime || 0)}
            </h2>
          </center>
        </Box>

        {/* Table Section */}
        <Box>
          <Table className="version-table" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>App Name</Table.Th>
                <Table.Th>Version</Table.Th>
                <Table.Th>Last Updated</Table.Th>
                <Table.Th>Updated By</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr >
                <Table.Td>{storedMachines[selectedMachineId]?.appName}</Table.Td>
                <Table.Td>{storedMachines[selectedMachineId]?.currentVersion}</Table.Td>
                <Table.Td>{storedMachines[selectedMachineId]?.dateAddedOn}</Table.Td>
                <Table.Td>{storedMachines[selectedMachineId]?.lastUpdatedBy}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

        </Box>
      </Box>

      {/* Modal for Configure Update */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Configure Update"
        centered
      >
        <Box>
          <Text>Select App*</Text>
          <Select
            data={appVersions.map((app) => app.appName)}
            placeholder="Select App"
          />
          <Text mt="md">Select App Version*</Text>
          <Select
            data={appVersions.map((app) => app.appVersion)}
            placeholder="Select App Version"
          />
          <Button mt="md" fullWidth>
            Deploy
          </Button>
        </Box>
      </Modal>
    </Stack>
  );
};