─────────────────────┐
                    │       USER          │
                    │  (Central Hub)      │
                    └─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   PROJECT     │    │  PROJECTLEAD  │    │ PROJECTMEMBER │
│  (Creator)    │    │   (User is    │    │  (User is     │
│  (Owner)      │    │    Lead)      │    │   Member)     │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     │                     │
┌───────────────┐             │                     │
│  PROJECTGROUP │             │                     │
│  (Admin who   │             │                     │
│   created)    │             │                     │
└───────────────┘             │                     │
                              │                     │
        ┌─────────────────────┼─────────────────────┘
        │                     │
        ▼                     ▼
┌───────────────┐    ┌───────────────┐
│   JOINREQUEST │    │     TASK      │
│  (User who    │    │  (Assigned    │
│   requested)  │    │   To User)    │
│  (User who    │    │  (Assigned    │
│   reviewed)   │    │   By User)    │
└───────────────┘    └───────────────┘
        │                     │
        │                     ▼
        │             ┌───────────────┐
        │             │  TASKCOMMENT  │
        │             │  (User who    │
        │             │   commented)  │
        │             └───────────────┘
        │
        ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ PROJECTMESSAGE│    │  ACTIVITYLOG  │    │ NOTIFICATION  │
│  (User who    │    │  (User who    │    │  (User who    │
│   sent)       │    │   performed)  │    │   receives)   │
└───────────────┘    └───────────────┘    └───────────────┘