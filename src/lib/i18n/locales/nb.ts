/** Turns every string literal in a translation tree into `string`, so other languages must supply the same keys. */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

/** Norwegian (bokmål) is the default language and defines the key structure. */
export const nb = {
  app: {
    title: "DNS-panel",
  },
  general: {
    name: "Navn",
    id: "ID",
    comment: "Kommentar",
    seconds: "sekunder",
  },
  errors: {
    cannotLoadApp: "Kunne ikke starte applikasjonen",
  },
  navbarTitles: {
    myPage: "Min side",
    zones: "Soner",
    pendingChanges: "Ventende endringer",
    auditLog: "Logg",
    rolesAndPermissions: "Roller og tillatelser",
    accessGroups: "Tilgangsgrupper",
    settings: "Innstillinger",
  },
  myPage: {
    zonesInProgress: {
      title: "Soner under arbeid",
      total_one: "{{count}} sone totalt",
      total_other: "{{count}} soner totalt",
      unpublishedChanges_one: "{{count}} upublisert endring",
      unpublishedChanges_other: "{{count}} upubliserte endringer",
      lastEdit: "Siste endring i dag kl. {{time}}",
      reviewAndPublish: "Gjennomgå og publiser",
    },
    favoritedZones: {
      title: "Favorittsoner",
    },
    myGroups: {
      title: "Mine grupper",
      count: "{{shown}} av {{total}}",
    },
  },
  zones: {
    zone: "Sone",
    zones: "Soner",
    newZone: "Ny sone",
    form: {
      zone: {
        title: "Sone",
        description: "Navnet kan ikke endres etter sonen er opprettet.",
        field: {
          zoneName: {
            title: "Sonenavn",
            placeholder: "service.example.no",
          },
          description: {
            title: "Beskrivelse (valgfri)",
            placeholder: "Hva sonen brukes til",
          },
        },
      },
      access: {
        title: "Tilgang",
        description: "Kun medlemmer i valgte grupper kan endre denne sonen.",
        field: {
          accessGroups: {
            title: "Tilgangsgrupper",
            selectLabel: "Legg til gruppe",
            remove: "Fjern {{name}}",
            description:
              "Du kan kun velge grupper du er medlem av. Administratorer kan velge alle grupper.",
          },
          owner: {
            title: "Eier (valgfri)",
            selectLabel: "Ingen eier",
            description: "Organisasjonen eller kunden som eier sonen.",
          },
        },
      },
      view: {
        title: "Visning",
        description: "Visningene kan ha identisk eller individuelt innhold.",
        field: {
          internet: {
            title: "Internett",
            description: "Offentlig DNS",
          },
          helsenett: {
            title: "Helsenett",
            description: "DNS for Helsenett",
          },
          datacenter: {
            title: "Datasenter",
            description: "Ikke i bruk",
          },
        },
      },
      statusAndTtl: {
        title: "Status og TTL",
        field: {
          status: {
            title: "Status",
            active: {
              title: "Aktiv",
              description: "Sonen brukes og er publisert på DNS-serverne.",
            },
            inactive: {
              title: "Inaktiv",
              description:
                "Sonen er ikke publisert, men innholdet lagres. Kan brukes for å reservere navnet.",
            },
          },
          defaultTtl: {
            title: "Standard TTL",
            options: {
              fiveMinutes: "5m",
              oneHour: "1t",
              fourHours: "4t",
              twelveHours: "12t",
              oneDay: "1d",
              custom: "Tilpasset",
            },
            units: {
              hours: "t",
              minutes: "min",
              seconds: "sek",
            },
          },
        },
      },
      soa: {
        title: "SOA",
        description: "Serienummeret settes av APIet ved publisering.",
        field: {
          primaryNs: {
            title: "Primær navneserver",
            description:
              "Settes automatisk fra den første NS-recorden. Kan kun endres av brukere som kan redigere NS-records.",
          },
          hostmaster: {
            title: "Hostmaster",
            description: "Kun lesbar foreløpig.",
          },
          refresh: { title: "Refresh" },
          retry: { title: "Retry" },
          expire: { title: "Expire" },
          negativeTtl: { title: "Negativ TTL" },
          serial: {
            title: "Serienummer",
            value: "Settes automatisk",
          },
        },
      },
      nameServers: {
        title: "Navneservere",
        description: "Setter på NS records i sonen.",
        field: {
          automatic: {
            title: "Automatisk",
            badge: "Anbefalt",
            description:
              "De fleste brukere trenger ikke å administrere NS-records selv. Med flere visninger er NS-recordene ulike per visning, noe som gjør det lett å gjøre feil.",
          },
          manual: {
            title: "Manuell",
            description: "Krever superadmin-tilgang til sonen.",
            noAccess: "Du har ikke denne tilgangen.",
          },
        },
      },
      advanced: {
        title: "Avansert",
        field: {
          rpz: {
            title: "RPZ-sone",
            badge: "Kun synlig for administratorer",
            description: "Oppretter en response policy zone.",
          },
        },
      },
      actions: {
        create: "Opprett sone",
        creating: "Oppretter…",
        cancel: "Avbryt",
        footerHint: "Du får tilgang til sonen gjennom gruppene du velger.",
      },
      errors: {
        required: "Påkrevd",
        invalidDomain: "Må være et gyldig domenenavn",
        descriptionTooLong: "Maks 500 tegn",
        pickGroup: "Velg minst én gruppe",
        pickView: "Velg minst én visning",
        mustBeNumber: "Må være et tall",
        mustBeWholeNumber: "Må være et heltall",
        mustBeNonNegative: "Må være 0 eller høyere",
      },
    },
    view: "Visning",
    allViews: "Alle visninger",
    search: "Søk",
    tabs: {
      all: "Alle",
      favorites: "Favoritter",
    },
  },
  table: {
    previous: "Forrige",
    next: "Neste",
    empty: "Tomt resultat",
    showing: "Viser {{from}}-{{to}} av {{total}}",
  },
} as const;

/** The shape every language file must follow. */
export type Translations = Widen<typeof nb>;
