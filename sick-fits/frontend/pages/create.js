//stateless functional component

import CreateItem from "../components/CreateItem";

const Create = ({ query }) => (
  <div>
    <CreateItem id={query.id} />
  </div>
);

export default Create;
