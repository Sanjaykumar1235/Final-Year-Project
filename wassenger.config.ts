// wassenger.config.ts
// -----------------------------------------------------------------------------
// AUTO-GENERATED CONFIGURATION FILE.
// DO NOT modify the sections labeled "AUTO-GENERATED".
//
// Copyright (c) 2025 Smackcoders. All rights reserved.
// This file is subject to the Smackcoders Proprietary License.
// Unauthorized copying or distribution is strictly prohibited.
// -----------------------------------------------------------------------------

export const XappName = "wassenger";
export const modules = [
  {
    "module": "message",
    "actions": [
      "getMany",
      "get",
      "create",
      "update",
      "delete"
    ],
    "triggers": []
  },
  {
    "module": "contact",
    "actions": [
      "get",
      "create",
      "update",
      "delete",
      "getMany"
    ],
    "triggers": []
  },
  {
    "module": "campaigns",
    "actions": [
      "get",
      "create",
      "update",
      "delete",
      "getMany"
    ],
    "triggers": []
  },
  {
    "module": "label",
    "actions": [
      "create",
      "update",
      "delete",
      "getMany"
    ],
    "triggers": []
  },
  {
    "module": "user",
    "actions": [
      "get",
      "create",
      "update",
      "delete",
      "getMany"
    ],
    "triggers": []
  },
  {
    "module": "chatmessages",
    "actions": [
      "get",
      "search",
      "update",
      "delete"
    ],
    "triggers": []
  },
  {
    "module": "chat",
    "actions": [
      "get",
      "delete",
      "sync",
      "assign",
      "unassign"
    ],
    "triggers": []
  },
  {
    "module": "invoice",
    "actions": [
      "getMany"
    ],
    "triggers": []
  },
  {
    "module": "department",
    "actions": [
      "get",
      "create",
      "update",
      "delete",
      "getMany"
    ],
    "triggers": []
  },
  {
    "module": "note",
    "actions": [
      "create",
      "delete"
    ],
    "triggers": []
  },
  {
    "module": "webhook",
    "actions": [
      "get",
      "create",
      "update",
      "delete"
    ],
    "triggers": []
  }
];

export default {
  XappName,
  modules,
};
