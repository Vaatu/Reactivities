import { Button, ButtonGroup, Grid, GridColumn, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
    uploadPhoto: (file: Blob) => void;
    loading: boolean;

}

export default function PhotoUploadWidget({ uploadPhoto, loading }: Props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper)
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));

    }
    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])

    return (
        <Grid>
            <GridColumn width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo' />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </GridColumn>

            <GridColumn width={1} />

            <GridColumn width={4}>
                <Header sub color='teal' content='Step 2 - Resize image' />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </GridColumn>

            <GridColumn width={1} />

            <GridColumn width={4}>
                <Header sub color='teal' content='Step 3 - Preview & upload' />

                {files && files.length > 0 &&
                    <>
                        <div className="img-preview" style={{ minHeight: 200, overflow: 'hidden' }} />
                        <ButtonGroup widths={2}>
                            <Button loading={loading} positive icon='check' onClick={onCrop} />
                            <Button disabled={loading} icon='close' onClick={() => setFiles([])} />
                        </ButtonGroup>
                    </>
                }
            </GridColumn>
        </Grid>
    )
}