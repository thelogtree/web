import { Logtree } from "logtree-node";

export const MyLogtree = new Logtree(
  process.env.REACT_APP_LOGTREE_PUBLISHABLE_API_KEY || "",
  process.env.REACT_APP_LOGTREE_SECRET_KEY || ""
);
