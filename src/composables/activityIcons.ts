// Activity icon mapping, adapted from mygoal-webapp-ui's
// src/composables/iconWrapper.ts + ActivityKind enum
// (src/types/models.ts). Icon assets copied from that repo's
// public/img/trainingschedule/icons/ (see src/assets/svg/activities/).
//
// Values intentionally match webapp-ui's ActivityKind strings 1:1 so a
// later real API can reuse the same activity-type vocabulary without a
// translation layer here.
import allgemeinefitness from '@/assets/svg/activities/allgemeinefitness.svg'
import alternativtraining from '@/assets/svg/activities/alternativtraining.svg'
import athletik from '@/assets/svg/activities/athletik.svg'
import general from '@/assets/svg/activities/general.svg'
import indoorcycling from '@/assets/svg/activities/indoorcycling.svg'
import joker from '@/assets/svg/activities/joker.svg'
import laufen from '@/assets/svg/activities/laufen.svg'
import mtb from '@/assets/svg/activities/mtb.svg'
import radfahren from '@/assets/svg/activities/radfahren.svg'
import regeneration from '@/assets/svg/activities/regeneration.svg'
import rollski from '@/assets/svg/activities/rollski.svg'
import schwimmen from '@/assets/svg/activities/schwimmen.svg'
import skaten from '@/assets/svg/activities/skaten.svg'
import skilanglauf from '@/assets/svg/activities/skilanglauf.svg'
import testwettkampf from '@/assets/svg/activities/testwettkampf.svg'
import trainingsfrei from '@/assets/svg/activities/trainingsfrei.svg'
import wettkampf from '@/assets/svg/activities/wettkampf.svg'
import yoga from '@/assets/svg/activities/yoga.svg'
import type { ActivityKind } from '@/types/dashboard'

export const activityIcons: Record<ActivityKind, string> = {
  general,
  joker,
  trainingsfrei,
  testwettkampf,
  wettkampf,
  laufen,
  athletik,
  regeneration,
  schwimmen,
  radfahren,
  allgemeinefitness,
  alternativtraining,
  indoorcycling,
  mtb,
  rollski,
  skaten,
  skilanglauf,
  yoga,
}
