    
    //ZoneChanges is the change done on the zone-data (not the records in the zone)
    export type ZoneChange = {
        field: string 
        oldvalue: any
        newvalue: any
        change_uid: string
        changed_by: string
        changed_at: string
    }

    export type ZoneChanges = {
        zone_uid: string  // Zone UID
        name: string  // Zone name
        changes: ZoneChange[] // List of changes for the zone
    }

    //RecordChanges is the change done on the records within a zone
    //Record represents a DNS record within a zone (e.g., A, AAAA, CNAME, etc.)
    export type Record = {
        uid: string
        name: string
        ttl: number
        class: string
        a: string
    }

    //RecordChange is the change done on a specific record within a zone 
    //Similar to ZoneChange, but with a record_uid to identify the specific record that changed
    export type RecordChange = {
        record_uid: string
        field: string
        oldvalue: any
        newvalue: any
        change_uid: string
        changed_by: string
        changed_at: string
    }

    
    export type RecordChanges = {
        zone_uid: string
        records: Record[] // List of complete record data for the changed records (for display)
        changes: RecordChange[] // List of changes for the records within the zone
    }
    
    /* API endpoint: Zone changes
    [
        {
            "zone_uid": "000-000-000", // Zone UID
            "name": "example.com", // Zone name
            // .. additional zone fields here ...
            "changes": [
                {
                    "field": "default_ttl",
                    "oldvalue": 3600,
                    "newvalue": 7200,
                    "change_uid": "999-999-900", // The audit log change UID (will be implemented later)
                    "changed_by": "user@example.com", // Who made the change
                    "changed_at": "2024-06-06T12:00:00Z", // The timestamp when the change was made
                },
                {
                    "field": "negative_ttl",
                    "oldvalue": 120,
                    "newvalue": 60,
                    "change_uid": "999-999-901", // The audit log change UID (will be implemented later)
                    "changed_by": "user@example.com", // Who made the change
                    "changed_at": "2024-06-06T12:00:00Z", // The timestamp when the change was made
                },
                // Additional zone field changes here
            ]
        },
        // Additional zones here
    ]
    */
    /* API endpoint: Record changes for one zone
    {
        "zone_uid": "000-000-000", // Zone UID - Needed? You must have the zone uid anyway to fetch this
        "records": [ // List of complete record data for the changed records (for display)
            {
                "uid": "111-111-100",
                "name": "examplerecord",
                "ttl": 60,
                "class": "in",
                "a": "2.2.2.2"
            },
            {
                "uid": "111-111-101",
                "name": "examplerecord2",
                "ttl": 120,
                "class": "in",
                "a": "3.3.3.3"
            },
            // Additional record entries here
        ],
        "changes": [ // List of changes for the records provided in "records"
            {
                "record_uid": "111-111-101",
                "field": "a",
                "oldvalue": "2.2.2.2",
                "newvalue": "3.3.3.3",
                "change_uid": "999-999-905",
                "changed_by": "user@example.com",
                "changed_at": "2024-06-06T12:00:00Z"
            },
            // Additional record field changes here
        ]
    }
    */