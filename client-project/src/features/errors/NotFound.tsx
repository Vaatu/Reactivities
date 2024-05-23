import { Link } from "react-router-dom";
import { Button, Header, Segment, SegmentInline } from "semantic-ui-react";

export default function NotFound() {
    return (<>
        <Segment placeholder>
            <Header icon>
                Oops - We've looked everywhere but couldn't find what you are looking for!
            </Header>
            <SegmentInline>
                <Button as={Link} to='/activities' >
                    Return to activities page
                </Button>
            </SegmentInline>
        </Segment></>)
}