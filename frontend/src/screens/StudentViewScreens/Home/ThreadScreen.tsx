import {Channel, Thread} from 'stream-chat-expo'; // Or stream-chat-expo
import { useAppContext } from '../../../context/AppContext';

const ThreadScreen = () => {
    const { channel, thread } = useAppContext();

    return (
        <Channel channel={channel} thread={thread} threadList>
            <Thread />
        </Channel>
    );
}

export default ThreadScreen;