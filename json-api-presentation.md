## JSON API Spec

Implemented with [`active_model_serializers`](https://github.com/rails-api/active_model_serializers)

---

## Large Spec

Includes helpful permission words like `May`, `Must`, etc...

---

## Filtering, Pagination, Media Types etc...

---

## Structure!

```
{
  "data": {
    "id": "1",
    "type": "cats",
    "attributes": {
      "name": "kat",
      "disposition": "meowy"
    },
    "relationships": {
      "litter-boxes": {
        "data": []
      }
    }
  }
}
```

---

## For us

  - attributes
  - relationships
  - meta
  - _no links_ thus yet

---

## Also!

  - top level data key
    - includes single or array of resource objects
  - resource object should have an `id` and `type`

  [here](https://docs.google.com/document/d/132ACiNa10KKmumazt-USPu5cFM8AWcRuJnxxJqDnACs/edit)

---

## Good news

We don't have to implement all of the spec to be a JSON API

---

## Getting started

We have the beginnings of a JSON API.
Let's see if we can update a `relationship`!
We will be emulating [this](http://jsonapi.org/format/#crud-updating-relationships).

---

## Write a proper request test

Let's see that we can add a litter box to a cat.

---

## Success!

---

## Other options

[jsonapi-utils](https://github.com/tiagopog/jsonapi-utils)
  - Resource focused
  - deals with serializing and deserializing

---

## Next time

Use the [experimental](https://github.com/rails-api/active_model_serializers/blob/master/docs/general/deserialization.md) `active_model_serializers` deserialization feature

---

## Thanks
