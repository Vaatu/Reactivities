import { Tab } from "semantic-ui-react"
import ProfilePhotos from "./ProfilePhotos"
import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import ProfileActivities from "./ProfileActivities";
import { useStore } from "../../app/stores/store";


interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
  const { profileStore } = useStore();
  const panes = [
    { menuItem: 'About', render: () => <ProfileAbout>About Content</ProfileAbout> },
    { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: 'Events', render: () => <ProfileActivities/> },
    { menuItem: 'Followers', render: () => <ProfileFollowings /> },
    { menuItem: 'Following', render: () => <ProfileFollowings /> }
  ]


  return (
    <Tab menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(_, data) => profileStore.setActiveTab(data.activeIndex as number)}
    />
  )

})