import { lazy } from "react";
import { Navigate } from "react-router";

const LoginScreen = lazy(() => import("@/pages/auth/LoginScreen"));
const RegisterScreen = lazy(() => import("@/pages/auth/RegisterScreen"));
const VerifyScreen = lazy(() => import("@/pages/auth/VerifyScreen"));
const TermsScreen = lazy(() => import("@/pages/auth/TermsScreen"));

const OnboardingAccountTypeScreen = lazy(() => import("@/pages/onboarding/OnboardingAccountTypeScreen"));
const OnboardingContractsScreen = lazy(() => import("@/pages/onboarding/OnboardingContractsScreen"));
const OnboardingSignScreen = lazy(() => import("@/pages/onboarding/OnboardingSignScreen"));
const OnboardingSetupScreen = lazy(() => import("@/pages/onboarding/OnboardingSetupScreen"));
const OnboardingCompleteScreen = lazy(() => import("@/pages/onboarding/OnboardingCompleteScreen"));

const DashboardScreen = lazy(() => import("@/pages/DashboardScreen"));
const AccountStatusScreen = lazy(() => import("@/pages/AccountStatusScreen"));
const AccountTaxScreen = lazy(() => import("@/pages/AccountTaxScreen"));
const DistributionAgreementScreen = lazy(() => import("@/pages/DistributionAgreementScreen"));
const CatalogScreen = lazy(() => import("@/pages/CatalogScreen"));
const ReleaseDetailScreen = lazy(() => import("@/pages/ReleaseDetailScreen"));
const RevenueScreen = lazy(() => import("@/pages/RevenueScreen"));
const ReportsScreen = lazy(() => import("@/pages/ReportsScreen"));
const ProfileScreen = lazy(() => import("@/pages/ProfileScreen"));
const StatementDetailScreen = lazy(() => import("@/pages/StatementDetailScreen"));
const HelpScreen = lazy(() => import("@/pages/HelpScreen"));
const UsersScreen = lazy(() => import("@/pages/UsersScreen"));
const NotFoundScreen = lazy(() => import("@/pages/NotFoundScreen"));

const MusicWizard = lazy(() => import("@/pages/submit/MusicWizard"));
const SubmitStep1 = lazy(() => import("@/pages/submit/SubmitStep1"));
const SubmitStep2 = lazy(() => import("@/pages/submit/SubmitStep2"));
const SubmitTracksScreen = lazy(() => import("@/pages/submit/SubmitTracksScreen"));
const SubmitCoverArtScreen = lazy(() => import("@/pages/submit/SubmitCoverArtScreen"));
const SubmitSettingsScreen = lazy(() => import("@/pages/submit/SubmitSettingsScreen"));
const SubmitReviewScreen = lazy(() => import("@/pages/submit/SubmitReviewScreen"));
const SubmitSuccessScreen = lazy(() => import("@/pages/submit/SubmitSuccessScreen"));
const SubmitAudioBookInfoScreen = lazy(() => import("@/pages/submit/SubmitAudioBookInfoScreen"));
const SubmitFilmInfoScreen = lazy(() => import("@/pages/submit/SubmitFilmInfoScreen"));

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
  { path: "/users",                   element: <UsersScreen /> },
  { path: "/help",                    element: <HelpScreen /> },
  { path: "*",                        element: <NotFoundScreen /> },
];
