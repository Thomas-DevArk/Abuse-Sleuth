import { faFile, faLaptop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Box,
    Button,
    Center,
    Checkbox,
    Divider,
    Group,
    MantineTheme,
    Text,
    Textarea,
    ThemeIcon,
    useMantineTheme,
} from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { useForm } from "@mantine/hooks";
import axios from "axios";
import { useRef, useState } from "react";
import Papa from "papaparse";
import { sendLog } from "../lib/helpers/apiHelper";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][6]
        : status.rejected
        ? theme.colors.red[6]
        : theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.black;
}

const LogScanForm: React.FC = () => {
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(false);
    const [generateReport, setGenerateReport] = useState(false);
    const [reportID, setReportID] = useState(-1);

    const onDropFile = (file: File) => {
        setLoading(true);

        const reader = new FileReader();

        reader.onloadend = async ({ target }) => {
            if (target == null) {
                return;
            }
            const csv = Papa.parse(target.result as string, { header: true });
            const RawIPAddresses = csv.data.map((x: any) => {
                const rawField: string = x["Source IP"];
                if (rawField) {
                    return rawField.split(" ")[0];
                } else {
                    return "0.0.0.0";
                }
            });

            // TODO: Unique IP
            const IPAddresses = [...new Set(RawIPAddresses)];

            // TODO: Add the WEB REQUEST
            const reportId = await sendLog(IPAddresses, generateReport);

            setReportID(reportId);
            setLoading(false);
        };

        reader.readAsText(file);
    };

    return (
        <>
            <Center mb="xs">
                <Checkbox
                    checked={generateReport}
                    onChange={(event) =>
                        setGenerateReport(event.currentTarget.checked)
                    }
                    label={"Generate Report?"}
                />
            </Center>
            <Dropzone
                multiple={false}
                onDrop={(files) => onDropFile(files[0])}
                onReject={(files) => console.log("rejected files", files)}
                loading={loading}
            >
                {(status) => (
                    <Group position="center" direction={"row"} spacing={"xl"}>
                        <ThemeIcon
                            size={80}
                            color={getIconColor(status, theme)}
                        >
                            <FontAwesomeIcon icon={faFile} size={"3x"} />
                        </ThemeIcon>

                        <Box>
                            <Text inline>
                                Drag CSV here or Click to select file
                            </Text>
                        </Box>
                    </Group>
                )}
            </Dropzone>
            {reportID !== -1 ? (
                <Text mt={"xs"}>Report #{reportID} Generated!</Text>
            ) : (
                ""
            )}
        </>
    );
};

export default LogScanForm;
