import { Navigate } from "react-router";

import LoginScreen from "@/pages/auth/LoginScreen";
import RegisterScreen from "@/pages/auth/RegisterScreen";
import VerifyScreen from "@/pages/auth/VerifyScreen";
import TermsScreen from "@/pages/auth/TermsScreen";

import OnboardingAccountTypeScreen from "@/pages/onboarding/OnboardingAccountTypeScreen";
import OnboardingContractsScreen from "@/pages/onboarding/OnboardingContractsScreen";
import OnboardingSignScreen from "@/pages/onboarding/OnboardingSignScreen";
import OnboardingSetupScreen from "@/pages/onboarding/OnboardingSetupScreen";
import OnboardingCompleteScreen from "@/pages/onboarding/OnboardingCompleteScreen";

import DashboardScreen from "@/pages/DashboardScreen";
import AccountStatusScreen from "@/pages/AccountStatusScreen";
import AccountTaxScreen from "@/pages/AccountTaxScreen";
import DistributionAgreementScreen from "@/pages/DistributionAgreementScreen";
import PaymentInfoScreen from "@/pages/PaymentInfoScreen";
import CatalogScreen from "@/pages/CatalogScreen";
import ReleaseDetailScreen from "@/pages/ReleaseDetailScreen";
import RevenueScreen from "@/pages/RevenueScreen";
import ReportsScreen from "@/pages/ReportsScreen";
import ProfileScreen from "@/pages/ProfileScreen";
import StatementDetailScreen from "@/pages/StatementDetailScreen";
import HelpScreen from "@/pages/HelpScreen";
import UsersScreen from "@/pages/UsersScreen";
import NotFoundScreen from "@/pages/NotFoundScreen";

import MusicWizard from "@/pages/submit/MusicWizard";
import SubmitStep1 from "@/pages/submit/SubmitStep1";
import SubmitStep2 from "@/pages/submit/SubmitStep2";
import SubmitTracksScreen from "@/pages/submit/SubmitTracksScreen";
import SubmitCoverArtScreen from "@/pages/submit/SubmitCoverArtScreen";
import SubmitSettingsScreen from "@/pages/submit/SubmitSettingsScreen";
import SubmitReviewScreen from "@/pages/submit/SubmitReviewScreen";
import SubmitSuccessScreen from "@/pages/submit/SubmitSuccessScreen";
import SubmitAudioBookInfoScreen from "@/pages/submit/SubmitAudioBookInfoScreen";
import SubmitFilmInfoScreen from "@/pages/submit/SubmitFilmInfoScreen";

export const routes = [
  { path: "/",                        element: <Navigate to="/login" replace /> },
  { path: "/login",                   element: <LoginScreen /> },
  { path: "/register",                element: <RegisterScreen /> },
  { path: "/verify",                  element: <VerifyScreen /> },
  { path: "/terms",                   element: <TermsScreen /> },
  { path: "/onboarding/account-type", element: <OnboardingAccountTypeScreen /> },
  { path: "/onboarding/contracts",    element: <OnboardingContractsScreen /> },
  { path: "/onboarding/sign",         element: <OnboardingSignScreen /> },
  { path: "/onboarding/setup",        element: <OnboardingSetupScreen /> },
  { path: "/onboarding/complete",     element: <OnboardingCompleteScreen /> },
  { path: "/dashboard",               element: <DashboardScreen /> },
  { path: "/reports",                  element: <ReportsScreen /> },
  { path: "/revenue",                 element: <RevenueScreen /> },
  { path: "/revenue/statement",       element: <StatementDetailScreen /> },
  // ── Releases (music) ──────────────────────────────────────────────────────
  { path: "/releases",                element: <CatalogScreen /> },
  { path: "/releases/new",            element: <CatalogScreen /> },
  { path: "/releases/new/single",     element: <MusicWizard /> },
  { path: "/releases/new/album",      element: <MusicWizard /> },
  { path: "/releases/new/video",      element: <MusicWizard /> },
  { path: "/releases/:id/edit",       element: <MusicWizard /> },
  { path: "/releases/:id",            element: <ReleaseDetailScreen /> },

  // ── Audiobooks ─────────────────────────────────────────────────────────────
  { path: "/audiobooks",              element: <CatalogScreen /> },
  { path: "/audiobooks/new",          element: <SubmitAudioBookInfoScreen /> },
  { path: "/audiobooks/:id/edit",     element: <SubmitAudioBookInfoScreen /> },
  { path: "/audiobooks/:id",          element: <ReleaseDetailScreen /> },

  // ── Movies ─────────────────────────────────────────────────────────────────
  { path: "/movies",                  element: <CatalogScreen /> },
  { path: "/movies/new",              element: <SubmitFilmInfoScreen /> },
  { path: "/movies/:id/edit",         element: <SubmitFilmInfoScreen /> },
  { path: "/movies/:id",              element: <ReleaseDetailScreen /> },

  // ── Legacy catalog redirects ───────────────────────────────────────────────
  { path: "/catalog",                 element: <Navigate to="/releases" replace /> },
  { path: "/catalog/music",           element: <Navigate to="/releases" replace /> },
  { path: "/catalog/audiobook",       element: <Navigate to="/audiobooks" replace /> },
  { path: "/catalog/film",            element: <Navigate to="/movies" replace /> },

  { path: "/submit",                  element: <SubmitStep1 /> },
  { path: "/submit/release",           element: <MusicWizard /> },
  { path: "/submit/release-info",     element: <SubmitStep2 /> },
  { path: "/submit/tracks",           element: <SubmitTracksScreen /> },
  { path: "/submit/cover-art",        element: <SubmitCoverArtScreen /> },
  { path: "/submit/settings",         element: <SubmitSettingsScreen /> },
  { path: "/submit/review",           element: <SubmitReviewScreen /> },
  { path: "/submit/success",          element: <SubmitSuccessScreen /> },
  { path: "/submit/audiobook",         element: <SubmitAudioBookInfoScreen /> },
  { path: "/submit/film",             element: <SubmitFilmInfoScreen /> },
  { path: "/profile",                  element: <ProfileScreen /> },
  { path: "/account",                 element: <AccountStatusScreen /> },
  { path: "/account/tax",             element: <AccountTaxScreen /> },
  { path: "/account/agreement",       element: <DistributionAgreementScreen /> },
  { path: "/account/payment",         element: <PaymentInfoScreen /> },
  { path: "/users",                   element: <UsersScreen /> },
  { path: "/help",                    element: <HelpScreen /> },
  { path: "*",                        element: <NotFoundScreen /> },
];
