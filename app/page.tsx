import { getChatRoomData } from './api.service';

export default async function Home() {
  const data = await getChatRoomData();

  return (
    <div>
      <h2>Chat Rooms</h2>
    </div>
  );
}
