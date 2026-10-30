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
    loading: "Loading …",
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
    search: "Search",
    tabs: {
      all: "All",
      favorites: "Favorites",
    },
  },
  table: {
    previous: "Previous",
    next: "Next",
    empty: "No results",
    showing: "Showing {{from}}-{{to}} of {{total}}",
  },
  records: {
    type: "Type",
    ttl: "TTL",
    value: "Value",
    tabs: {
      all: "All",
    },
    search: "Search",
  },
};
