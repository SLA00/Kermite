import { applyGlobalStyle, css, FC, jsx, render, rerender } from 'qx';
import { kmsColors } from '~/ex_profileViewer/KmsColors';
import { KmsPresetKeyboardSection } from '~/ex_profileViewer/KmsPresetKeyboardSection';
import {
  debounce,
  fallbackProfileData,
  IPersistProfileData,
  IProfileData,
} from '~/shared';
import { ProfileDataConverter } from '~/shell/loaders/ProfileDataConverter';
import { ScalerBox } from '~/ui/common-svg/frames/ScalerBox';
import { usePresetKeyboardSectionViewModel } from '~/ui/preset-browser-page/viewModels';

const globalCss = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #app {
    height: 100%;
  }

  body {
    overflow: hidden;
  }

  #app {
    font-family: 'Roboto', sans-serif;
    background: ${kmsColors.pageBackground};
    color: ${kmsColors.pageText};
  }
`;

interface IProfileResponse {
  data: string;
  id: string;
  name: string;
  projectId: string;
  userDisplayName: string;
  description: string;
  lastUpdate: string;
}

const state = new (class {
  error: string = '';
  loadedProfile: IProfileData = fallbackProfileData;
})();

async function fetchProfile() {
  const params = new URLSearchParams(location.search);
  const profileId = params.get('profileId');
  const debugProfileUrl = params.get('debugProfileUrl');

  if (debugProfileUrl) {
    // fetch raw profile
    try {
      console.log(`loading profile from ${debugProfileUrl}`);
      const res = await fetch(debugProfileUrl);
      const persiteProfileData = (await res.json()) as IPersistProfileData;
      const profileData = ProfileDataConverter.convertProfileDataFromPersist(
        persiteProfileData,
      );
      console.log(`profile loaded`);
      // console.log({ profileData });
      state.loadedProfile = profileData;
    } catch (err) {
      console.error(err);
      state.error = 'failed to fetch data';
    }
  } else if (profileId) {
    // fetch profile from kermite server
    const profileUrl = `https://dev.server.kermite.org/api/profiles/${profileId}`;
    try {
      console.log(`loading profile from ${profileUrl}`);
      const res = await fetch(profileUrl);
      const obj = (await res.json()) as IProfileResponse;
      const persiteProfileData = JSON.parse(obj.data);
      const profileData = ProfileDataConverter.convertProfileDataFromPersist(
        persiteProfileData,
      );
      console.log(`profile loaded: ${obj.name} (by ${obj.userDisplayName})`);
      // console.log({ profileData });
      state.loadedProfile = profileData;
    } catch (err) {
      console.error(err);
      state.error = 'failed to fetch data';
    }
  } else {
    state.error = 'no profilleId search parameter in url';
    return;
  }
  rerender();
}

const ProfileViewContentRoot: FC = () => {
  const presetKeyboardSectionViewModel = usePresetKeyboardSectionViewModel(
    state.loadedProfile,
  );

  const cssBase = css`
    > .errorText {
      margin: 10px;
    }
    > .presetKeyboardSection {
      height: 400px;
    }
  `;
  return (
    <ScalerBox contentWidth={800} contentHeight={400}>
      <div css={cssBase}>
        <div qxIf={!!state.error} className="errorText">
          {state.error}
        </div>
        <KmsPresetKeyboardSection
          viewModel={presetKeyboardSectionViewModel}
          className="presetKeyboardSection"
          qxIf={!state.error}
        />
      </div>
    </ScalerBox>
  );
};

const PageRoot: FC = () => {
  const cssPageRoot = css`
    height: 100%;

    > .rootPanel {
      width: 100%;
      aspect-ratio: 2;
    }
  `;

  return (
    <div css={cssPageRoot}>
      <div class="rootPanel">
        <ProfileViewContentRoot />
      </div>
    </div>
  );
};

window.addEventListener('load', () => {
  console.log('profile viewer 210625g');
  applyGlobalStyle(globalCss);
  const appDiv = document.getElementById('app');
  render(() => <PageRoot />, appDiv);
  window.addEventListener('resize', debounce(rerender, 100));

  fetchProfile();
});
