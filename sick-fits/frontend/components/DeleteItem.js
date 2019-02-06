import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const update = (cache, payload) => {
  // clean up the cache
  // 1. Read the ALL_ITEMS_QUERY
  const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
  // console.log(data, payload);
  // 2. filter the deleted item from the page
  data.items = data.items.filter(
    item => item.id !== payload.data.deleteItem.id
  );
  // 3. Put the items back in the cache
  cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
};
/*
const confirmDelete = () => {
  if (confirm("Like a vasectomy; this action is not reversible. Proceed?")) {
    deleteItem();
  }
};
*/
const DeleteItem = props => {
  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATION}
      variables={{ id: props.id }}
      update={update}
    >
      {(deleteItem, { error }) => (
        <button
          onClick={() => {
            if (
              confirm(
                "Like a vasectomy; this action is not reversible. Proceed?"
              )
            ) {
              deleteItem();
            }
          }}
        >
          {props.children}
        </button>
      )}
    </Mutation>
  );
};

export default DeleteItem;
export { DELETE_ITEM_MUTATION };
