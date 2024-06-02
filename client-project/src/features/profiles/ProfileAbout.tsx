import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Grid, GridColumn, Header, TabPane } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";
import { useStore } from "../../app/stores/store";

export default observer(function ProfileAbout() {
    const [editMode, setEditMode] = useState(false);
    const { profile, isCurrentUser } = useStore().profileStore;

    return (
        <TabPane>
            <Grid>
                <GridColumn width={16}>
                    <Header
                        floated='left'
                        content={`About ${profile?.displayName}`} />
                    {isCurrentUser && (<Button
                        floated='right'
                        basic
                        content={editMode ? 'Cancel' : 'Edit Profile'}
                        onClick={() => setEditMode(!editMode)}
                    />)}
                </GridColumn>

                <GridColumn width={16}>
                    {editMode ? <ProfileEditForm setEditMode={setEditMode} /> :
                        <span style={{ whiteSpace: 'pre-wrap' }}>{profile?.bio}</span>}
                </GridColumn>
            </Grid>

        </TabPane>
    )
})