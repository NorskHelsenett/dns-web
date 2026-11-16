import type { Translations } from "./nb";

/** English translation. A missing or extra key is a type error and will result in failed build. */
export const en: Translations = {
  app: {
    title: "DNS panel",
  },
  general: {
    name: "Name",
    id: "ID",
    comment: "Comment",
    seconds: "seconds",
    loading: "Loading ...",
    search: "Search",
  },
  errors: {
    cannotLoadApp: "Cannot start the application",
  },
  myPage: {
    zonesInProgress: {
      title: "Zones in progress",
      total_one: "{{count}} zone total",
      total_other: "{{count}} zones total",
      unpublishedChanges_one: "{{count}} unpublished change",
      unpublishedChanges_other: "{{count}} unpublished changes",
      lastEdit: "Last edit today, {{time}}",
      reviewAndPublish: "Review and publish",
    },
    favoritedZones: {
      title: "Favorited zones",
    },
    myGroups: {
      title: "My groups",
      count: "{{shown}} of {{total}}",
    },
  },
  navbarTitles: {
    myPage: "My page",
    zones: "Zones",
    pendingChanges: "Pending changes",
    auditLog: "Audit log",
    rolesAndPermissions: "Roles and permissions",
    accessGroups: "Access groups",
    settings: "Settings",
  },
  zones: {
    zone: "Zone",
    zones: "Zones",
    newZone: "New zone",
    detail: {
      status: "Status",
      ttl: "TTL",
      view: "View",
      description: "Description",
      noDescription: "No description",
      notAvailable: "Not available",
    },
    form: {
      zone: {
        title: "Zone",
        description: "The name can't be changed after the zone is created.",
        field: {
          zoneName: {
            title: "Zone name",
            placeholder: "service.example.no",
          },
          description: {
            title: "Description (optional)",
            placeholder: "What the zone is used for",
          },
        },
      },
      access: {
        title: "Access",
        description: "Only members of the selected groups can change the zone.",
        field: {
          accessGroups: {
            title: "Access groups",
            selectLabel: "Add group",
            remove: "Remove {{name}}",
            description:
              "You can only pick groups you are a member of. Administrators can pick any group.",
          },
          owner: {
            title: "Owner (optional)",
            selectLabel: "No owner",
            description: "The organisation or customer that owns the zone.",
          },
        },
      },
      view: {
        title: "View",
        description: "The views can have identical or individual content.",
        field: {
          internet: {
            title: "Internet",
            description: "Public DNS",
          },
          helsenett: {
            title: "Helsenett",
            description: "DNS for Helsenett",
          },
          datacenter: {
            title: "Data center",
            description: "Not in use",
          },
        },
      },
      statusAndTtl: {
        title: "Status and TTL",
        field: {
          status: {
            title: "Status",
            active: {
              title: "Active",
              description: "The zone is in use and is published to the DNS servers.",
            },
            inactive: {
              title: "Inactive",
              description:
                "The zone is not published, but its content is kept. Can be used to reserve the name.",
            },
          },
          defaultTtl: {
            title: "Default TTL",
            options: {
              fiveMinutes: "5m",
              oneHour: "1h",
              fourHours: "4h",
              twelveHours: "12h",
              oneDay: "1d",
              custom: "Custom",
            },
            units: {
              hours: "h",
              minutes: "min",
              seconds: "sec",
            },
          },
        },
      },
      soa: {
        title: "SOA",
        description: "The serial number is set by the API on publish.",
        field: {
          primaryNs: {
            title: "Primary name server",
            description:
              "Set automatically from the first NS record. Can only be changed by users who can edit NS records.",
          },
          hostmaster: {
            title: "Hostmaster",
            description: "Read-only for now.",
          },
          refresh: { title: "Refresh" },
          retry: { title: "Retry" },
          expire: { title: "Expire" },
          negativeTtl: { title: "Negative TTL" },
          serial: {
            title: "Serial number",
            value: "Set automatically",
          },
        },
      },
      nameServers: {
        title: "Name servers",
        description: "Applies to the NS records in the zone.",
        field: {
          automatic: {
            title: "Automatic",
            badge: "Recommended",
            description:
              "Most users don't need to manage NS records themselves. With several views the NS records differ per view, which makes mistakes easy.",
          },
          manual: {
            title: "Manual",
            description: "Requires superadmin access to the zone.",
            noAccess: "You don't have this access.",
          },
        },
      },
      advanced: {
        title: "Advanced",
        field: {
          rpz: {
            title: "RPZ zone",
            badge: "Visible to administrators only",
            description: "Creates a response policy zone.",
          },
        },
      },
      actions: {
        create: "Create zone",
        creating: "Creating…",
        cancel: "Cancel",
        footerHint: "You get access to the zone through the groups you select.",
      },
      errors: {
        required: "Required",
        invalidDomain: "Must be a valid domain name",
        descriptionTooLong: "Max 500 characters",
        pickGroup: "Pick at least one group",
        pickView: "Select at least one view",
        mustBeNumber: "Must be a number",
        mustBeWholeNumber: "Must be a whole number",
        mustBeNonNegative: "Must be 0 or higher",
      },
    },
    view: "View",
    allViews: "All views",
    tabs: {
      all: "All",
      favorites: "Favorites",
    },
  },
  roles: {
    subtitle:
      "A role is a set of permissions. It applies either to all zones or to a list of zones.",
    newRole: "New role",
    allZones: "All zones",
    zonesCount_one: "{{count}} zone",
    zonesCount_other: "{{count}} zones",
    permissionsCount_one: "{{count}} permission",
    permissionsCount_other: "{{count}} permissions",
    list: {
      title: "Roles",
      readOnly: "Read-only",
      draft: "Draft",
    },
    editor: {
      untitled: "Untitled",
      description: "Description",
      delete: "Delete role",
      create: "Create role",
      cancel: "Cancel",
    },
    delete: {
      title: "Delete role?",
      description: "The role “{{name}}” will be deleted. This can't be undone.",
      confirm: "Delete role",
      cancel: "Cancel",
    },
    permissions: {
      title: "Permissions",
      available: "Available",
      selected: "Selected",
      selectedCount: "{{selected}} of {{total}} selected",
      filter: "Filter",
      addSelected: "Add selected permissions",
      addAll: "Add all permissions",
      removeAll: "Remove all permissions",
      removeSelected: "Remove selected permissions",
    },
    appliesTo: {
      title: "Applies to",
      all: {
        title: "All zones",
        description: "Full access to every zone, including zones created later.",
      },
      selected: {
        title: "Selected zones",
        description: "Only the zones in this list.",
      },
      remove: "Remove",
      removeZone: "Remove {{name}}",
      addZone: "Add zone",
      noZonesAvailable: "No zones available",
    },
  },
  auditLog: {
    description:
      "Who did what, to which resource, and how it went. Entries are added automatically and can't be edited or deleted.",
    exportCsv: "Export CSV",
    today: "Today",
    yesterday: "Yesterday",
    expand: "Show details for {{id}}",
    collapse: "Hide details for {{id}}",
    matchingEvents_one: "{{count}} matching event",
    matchingEvents_other: "{{count}} matching events",
    columns: {
      time: "Time",
      actor: "Actor",
      action: "Action",
      resource: "Resource",
      outcome: "Outcome",
    },
    actions: {
      publish: "Published changes",
      create: "Created zone",
      discard: "Discarded changes",
      updateRole: "Updated role",
      delete: "Deleted zone",
    },
    outcomes: { success: "Success", failed: "Failed", denied: "Denied" },
    resourceTypes: { zone: "Zone", role: "Role" },
    changes: { added: "Added", changed: "Changed", removed: "Removed" },
    filters: {
      allActions: "All actions",
      allActors: "All actors",
      allResources: "All resources",
      allOutcomes: "All outcomes",
      dateRange: "Date range",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      allTime: "All time",
      clear: "Clear filters",
      clearCorrelation: "Clear correlation ID filter",
    },
    details: {
      title: "Event details",
      summary: "Summary",
      serial: "Serial",
      context: "Context",
      correlationId: "Correlation ID",
      eventId: "Event ID",
      showRelated: "Show events with this ID",
      changes: "Changes",
      change: "Change",
      services: "Same request in other services",
      service: "Service",
      source: "Source",
    },
  },
  table: {
    previous: "Previous page",
    next: "Next page",
    empty: "No results",
    showing: "Showing {{from}}-{{to}} of {{total}}",
    showingGroups: "Showing {{from}}-{{to}} of {{total}} groups",
  },
  records: {
    type: "Type",
    ttl: "TTL",
    value: "Value",
    tabs: {
      all: "All",
    },
  },
};
