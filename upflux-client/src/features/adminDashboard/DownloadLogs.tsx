import { Button, Select, Stack, Text, Loader, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reduxSubscription/store";
import { getAllMachineLogs, getMachineLogs, getWebServiceLogs } from "../../api/adminApiActions";
import { notifications } from "@mantine/notifications";

export const DownloadLogs = ({ opened, close }) => {
    const [machineId, setMachineId] = useState<string | null>(null);
    const [multiSelectOptions, setMultiSelectOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Machine list from redux 
    const storedMachines = useSelector((root: RootState) => root.machines.messages);

    useEffect(() => {
        if (storedMachines) {
            const options = Object.keys(storedMachines).map((val) => ({
                value: val,
                label: val,
            }));
            setMultiSelectOptions(options);
            setLoading(false);  // Assume data is fetched and set loading to false
        }
    }, [storedMachines]); // This effect runs only when storedMachines changes


    const handleDownloadMachineLogs = async () => {
        await getMachineLogs([machineId]).catch(() => {
            notifications.show({
                title: "Web Service",
                position: "top-right",
                color: "red",
                autoClose: 3000,
                message: "Error downloading logs"
            })
        })
    }

    return (
        <Modal opened={opened} onClose={close} centered>

            <Stack align="center" className="form-stack">
                <Text className="form-title">QC Machine Logs</Text>



                {loading ? (
                    <Loader size="sm" />
                ) : (
                    <Select
                        value={machineId}
                        onChange={setMachineId}
                        data={multiSelectOptions}
                        label="Machine ID"
                        placeholder="Select a machine"
                        clearable
                    />
                )}

                <Button color="rgba(0, 3, 255, 1)" disabled={!machineId} onClick={handleDownloadMachineLogs}>
                    Download Machine Logs
                </Button>

                <Button onClick={getAllMachineLogs} color="rgba(0, 3, 255, 1)">Download All Machine Logs</Button>

                <Button onClick={getWebServiceLogs} color="rgba(0, 3, 255, 1)">Download Web Service Logs</Button>
            </Stack>
        </Modal>
    );
};
