export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abgabe: {
        Row: {
          datum: string | null
          empfaenger_kontakt: string | null
          empfaenger_name: string | null
          empfaenger_nutzer_id: string | null
          id: string
          koralle_id: string
          notiz: string | null
          nutzer_id: string
          preis: number | null
          stueckzahl: number | null
        }
        Insert: {
          datum?: string | null
          empfaenger_kontakt?: string | null
          empfaenger_name?: string | null
          empfaenger_nutzer_id?: string | null
          id?: string
          koralle_id: string
          notiz?: string | null
          nutzer_id: string
          preis?: number | null
          stueckzahl?: number | null
        }
        Update: {
          datum?: string | null
          empfaenger_kontakt?: string | null
          empfaenger_name?: string | null
          empfaenger_nutzer_id?: string | null
          id?: string
          koralle_id?: string
          notiz?: string | null
          nutzer_id?: string
          preis?: number | null
          stueckzahl?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "abgabe_empfaenger_nutzer_id_fkey"
            columns: ["empfaenger_nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abgabe_koralle_id_fkey"
            columns: ["koralle_id"]
            isOneToOne: true
            referencedRelation: "koralle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abgabe_nutzer_id_fkey"
            columns: ["nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      anfrage: {
        Row: {
          angebot_id: string
          erstellt_am: string
          id: string
          interessent_id: string
          nachricht: string | null
          status: Database["public"]["Enums"]["anfrage_status"]
        }
        Insert: {
          angebot_id: string
          erstellt_am?: string
          id?: string
          interessent_id: string
          nachricht?: string | null
          status?: Database["public"]["Enums"]["anfrage_status"]
        }
        Update: {
          angebot_id?: string
          erstellt_am?: string
          id?: string
          interessent_id?: string
          nachricht?: string | null
          status?: Database["public"]["Enums"]["anfrage_status"]
        }
        Relationships: [
          {
            foreignKeyName: "anfrage_angebot_id_fkey"
            columns: ["angebot_id"]
            isOneToOne: false
            referencedRelation: "angebot"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anfrage_interessent_id_fkey"
            columns: ["interessent_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      angebot: {
        Row: {
          art: string | null
          erstellt_am: string
          groesse: string | null
          handelsname: string | null
          id: string
          koralle_id: string
          modus: Database["public"]["Enums"]["angebot_modus"]
          nutzer_id: string
          preis_oder_tauschwunsch: string | null
          sichtbar: boolean
        }
        Insert: {
          art?: string | null
          erstellt_am?: string
          groesse?: string | null
          handelsname?: string | null
          id?: string
          koralle_id: string
          modus: Database["public"]["Enums"]["angebot_modus"]
          nutzer_id: string
          preis_oder_tauschwunsch?: string | null
          sichtbar?: boolean
        }
        Update: {
          art?: string | null
          erstellt_am?: string
          groesse?: string | null
          handelsname?: string | null
          id?: string
          koralle_id?: string
          modus?: Database["public"]["Enums"]["angebot_modus"]
          nutzer_id?: string
          preis_oder_tauschwunsch?: string | null
          sichtbar?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "angebot_koralle_id_fkey"
            columns: ["koralle_id"]
            isOneToOne: true
            referencedRelation: "koralle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "angebot_nutzer_id_fkey"
            columns: ["nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      becken: {
        Row: {
          beschreibung: string | null
          id: string
          name: string
          nutzer_id: string
          startdatum: string | null
          volumen_liter: number | null
        }
        Insert: {
          beschreibung?: string | null
          id?: string
          name: string
          nutzer_id: string
          startdatum?: string | null
          volumen_liter?: number | null
        }
        Update: {
          beschreibung?: string | null
          id?: string
          name?: string
          nutzer_id?: string
          startdatum?: string | null
          volumen_liter?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "becken_nutzer_id_fkey"
            columns: ["nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      becken_ereignis: {
        Row: {
          becken_id: string
          datum: string
          id: string
          koralle_id: string | null
          menge: string | null
          nutzer_id: string
          text: string | null
          typ: Database["public"]["Enums"]["ereignis_typ"]
        }
        Insert: {
          becken_id: string
          datum: string
          id?: string
          koralle_id?: string | null
          menge?: string | null
          nutzer_id: string
          text?: string | null
          typ: Database["public"]["Enums"]["ereignis_typ"]
        }
        Update: {
          becken_id?: string
          datum?: string
          id?: string
          koralle_id?: string | null
          menge?: string | null
          nutzer_id?: string
          text?: string | null
          typ?: Database["public"]["Enums"]["ereignis_typ"]
        }
        Relationships: [
          {
            foreignKeyName: "becken_ereignis_becken_id_fkey"
            columns: ["becken_id"]
            isOneToOne: false
            referencedRelation: "becken"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "becken_ereignis_koralle_id_fkey"
            columns: ["koralle_id"]
            isOneToOne: false
            referencedRelation: "koralle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "becken_ereignis_nutzer_id_fkey"
            columns: ["nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      bild_dokument: {
        Row: {
          aufnahmedatum: string | null
          bezeichnung: string | null
          id: string
          koralle_id: string
          nutzer_id: string
          storage_pfad: string
          typ: Database["public"]["Enums"]["medien_typ"]
        }
        Insert: {
          aufnahmedatum?: string | null
          bezeichnung?: string | null
          id?: string
          koralle_id: string
          nutzer_id: string
          storage_pfad: string
          typ: Database["public"]["Enums"]["medien_typ"]
        }
        Update: {
          aufnahmedatum?: string | null
          bezeichnung?: string | null
          id?: string
          koralle_id?: string
          nutzer_id?: string
          storage_pfad?: string
          typ?: Database["public"]["Enums"]["medien_typ"]
        }
        Relationships: [
          {
            foreignKeyName: "bild_dokument_koralle_id_fkey"
            columns: ["koralle_id"]
            isOneToOne: false
            referencedRelation: "koralle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bild_dokument_nutzer_id_fkey"
            columns: ["nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      historieneintrag: {
        Row: {
          bild_id: string | null
          datum: string
          erstellt_am: string
          id: string
          koralle_id: string
          nutzer_id: string
          text: string | null
          typ: Database["public"]["Enums"]["historie_typ"]
        }
        Insert: {
          bild_id?: string | null
          datum: string
          erstellt_am?: string
          id?: string
          koralle_id: string
          nutzer_id: string
          text?: string | null
          typ: Database["public"]["Enums"]["historie_typ"]
        }
        Update: {
          bild_id?: string | null
          datum?: string
          erstellt_am?: string
          id?: string
          koralle_id?: string
          nutzer_id?: string
          text?: string | null
          typ?: Database["public"]["Enums"]["historie_typ"]
        }
        Relationships: [
          {
            foreignKeyName: "historieneintrag_bild_id_fkey"
            columns: ["bild_id"]
            isOneToOne: false
            referencedRelation: "bild_dokument"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historieneintrag_koralle_id_fkey"
            columns: ["koralle_id"]
            isOneToOne: false
            referencedRelation: "koralle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historieneintrag_nutzer_id_fkey"
            columns: ["nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      koralle: {
        Row: {
          art: string | null
          becken_id: string
          belegnummer: string | null
          bezeichnung: string
          cites_nr: string | null
          erwerbsdatum: string | null
          fuetterung: string | null
          handelsname: string | null
          herkunft_notiz: string | null
          herkunftskette: string | null
          id: string
          licht: Database["public"]["Enums"]["stufe"] | null
          mutter_id: string | null
          nesselkraft: Database["public"]["Enums"]["stufe"] | null
          nutzer_id: string
          platzierung: Database["public"]["Enums"]["platzierung"] | null
          primaerbild: string | null
          quelle_name: string | null
          quelle_typ: Database["public"]["Enums"]["quelle_typ"] | null
          schutzstatus: Database["public"]["Enums"]["schutzstatus"] | null
          schwierigkeit: Database["public"]["Enums"]["stufe"] | null
          status: Database["public"]["Enums"]["koralle_status"]
          stroemung: Database["public"]["Enums"]["stufe"] | null
          wuchsform: string | null
        }
        Insert: {
          art?: string | null
          becken_id: string
          belegnummer?: string | null
          bezeichnung: string
          cites_nr?: string | null
          erwerbsdatum?: string | null
          fuetterung?: string | null
          handelsname?: string | null
          herkunft_notiz?: string | null
          herkunftskette?: string | null
          id?: string
          licht?: Database["public"]["Enums"]["stufe"] | null
          mutter_id?: string | null
          nesselkraft?: Database["public"]["Enums"]["stufe"] | null
          nutzer_id: string
          platzierung?: Database["public"]["Enums"]["platzierung"] | null
          primaerbild?: string | null
          quelle_name?: string | null
          quelle_typ?: Database["public"]["Enums"]["quelle_typ"] | null
          schutzstatus?: Database["public"]["Enums"]["schutzstatus"] | null
          schwierigkeit?: Database["public"]["Enums"]["stufe"] | null
          status?: Database["public"]["Enums"]["koralle_status"]
          stroemung?: Database["public"]["Enums"]["stufe"] | null
          wuchsform?: string | null
        }
        Update: {
          art?: string | null
          becken_id?: string
          belegnummer?: string | null
          bezeichnung?: string
          cites_nr?: string | null
          erwerbsdatum?: string | null
          fuetterung?: string | null
          handelsname?: string | null
          herkunft_notiz?: string | null
          herkunftskette?: string | null
          id?: string
          licht?: Database["public"]["Enums"]["stufe"] | null
          mutter_id?: string | null
          nesselkraft?: Database["public"]["Enums"]["stufe"] | null
          nutzer_id?: string
          platzierung?: Database["public"]["Enums"]["platzierung"] | null
          primaerbild?: string | null
          quelle_name?: string | null
          quelle_typ?: Database["public"]["Enums"]["quelle_typ"] | null
          schutzstatus?: Database["public"]["Enums"]["schutzstatus"] | null
          schwierigkeit?: Database["public"]["Enums"]["stufe"] | null
          status?: Database["public"]["Enums"]["koralle_status"]
          stroemung?: Database["public"]["Enums"]["stufe"] | null
          wuchsform?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "koralle_becken_id_fkey"
            columns: ["becken_id"]
            isOneToOne: false
            referencedRelation: "becken"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "koralle_mutter_id_fkey"
            columns: ["mutter_id"]
            isOneToOne: false
            referencedRelation: "koralle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "koralle_nutzer_id_fkey"
            columns: ["nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "koralle_primaerbild_fkey"
            columns: ["primaerbild"]
            isOneToOne: false
            referencedRelation: "bild_dokument"
            referencedColumns: ["id"]
          },
        ]
      }
      messwert: {
        Row: {
          becken_id: string
          datum: string
          einheit: string | null
          id: string
          nutzer_id: string
          parameter: Database["public"]["Enums"]["messparameter"]
          wert: number
        }
        Insert: {
          becken_id: string
          datum: string
          einheit?: string | null
          id?: string
          nutzer_id: string
          parameter: Database["public"]["Enums"]["messparameter"]
          wert: number
        }
        Update: {
          becken_id?: string
          datum?: string
          einheit?: string | null
          id?: string
          nutzer_id?: string
          parameter?: Database["public"]["Enums"]["messparameter"]
          wert?: number
        }
        Relationships: [
          {
            foreignKeyName: "messwert_becken_id_fkey"
            columns: ["becken_id"]
            isOneToOne: false
            referencedRelation: "becken"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messwert_nutzer_id_fkey"
            columns: ["nutzer_id"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      profil: {
        Row: {
          anzeigename: string
          erstellt_am: string
          id: string
          kontakt_email: string
          kontakt_telefon: string | null
        }
        Insert: {
          anzeigename: string
          erstellt_am?: string
          id: string
          kontakt_email: string
          kontakt_telefon?: string | null
        }
        Update: {
          anzeigename?: string
          erstellt_am?: string
          id?: string
          kontakt_email?: string
          kontakt_telefon?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      anfrage_status: "offen" | "ausgewaehlt" | "abgelehnt" | "zurueckgezogen"
      angebot_modus: "verschenken" | "tauschen" | "verkaufen"
      ereignis_typ: "wasserwechsel" | "fuetterung" | "vorfall"
      historie_typ: "system" | "journal" | "abgabe"
      koralle_status: "im_bestand" | "zur_abgabe" | "abgegeben" | "verendet"
      medien_typ: "bild" | "pdf"
      messparameter:
        | "kh"
        | "ca"
        | "mg"
        | "no3"
        | "po4"
        | "temperatur"
        | "salinitaet"
      platzierung: "unten" | "mitte" | "oben"
      quelle_typ: "haendler" | "privat" | "eigene_nachzucht"
      schutzstatus: "unbekannt" | "kein" | "cites_ii" | "cites_i"
      stufe: "gering" | "mittel" | "hoch"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      anfrage_status: ["offen", "ausgewaehlt", "abgelehnt", "zurueckgezogen"],
      angebot_modus: ["verschenken", "tauschen", "verkaufen"],
      ereignis_typ: ["wasserwechsel", "fuetterung", "vorfall"],
      historie_typ: ["system", "journal", "abgabe"],
      koralle_status: ["im_bestand", "zur_abgabe", "abgegeben", "verendet"],
      medien_typ: ["bild", "pdf"],
      messparameter: [
        "kh",
        "ca",
        "mg",
        "no3",
        "po4",
        "temperatur",
        "salinitaet",
      ],
      platzierung: ["unten", "mitte", "oben"],
      quelle_typ: ["haendler", "privat", "eigene_nachzucht"],
      schutzstatus: ["unbekannt", "kein", "cites_ii", "cites_i"],
      stufe: ["gering", "mittel", "hoch"],
    },
  },
} as const
