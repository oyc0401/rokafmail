import { Client } from "./client";
export default function LinkPage({ params }) {
  let domain = process.env.DOMAIN;
  let url = `https://${domain}/mail/${params.username}`;

  return <Client url={url} />;
}
