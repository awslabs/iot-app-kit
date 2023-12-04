# `@iot-app-kit/feature-toggles`

Provides a react based subsystem for interacting with feature toggling system in AWS Evidently or other feature toggle systems.

It supports boolean based toggling on "Variation" or "Treatment", or you can actually have variants supply a value you consume instead.

## Usage

### Static Feature Repository

allows for loading

```jsx
import {
    FeatureProvider,
    useFeature,
    StaticFeatureRepository,
} from '@iot-app-kit/feature-toggles';

const FeatureToggledComponent = () => {
    const [myFeature] = useFeature('EXAMPLE_FEATURE');

    return (
        <div>
            {myFeature.variation === 'C' && <section>This section is control</section>}
            {myFeature.variation === 'T1' && <section>This section is Treatment 1</section>}
        </div>
    );
};

const FeatureWithValueComponent = () => {
    const [myFeature] = useFeature('EXAMPLE_FEATURE');
    const textColor = myFeature.value || 'black';

    return <div style={{ color: textColor }}>This text should be {textColor}</div>;
};

const features = {
    EXAMPLE_FEATURE: {
        variation: 'T1',
        value: 'blue',
    },
};
// or
const features = JSON.parse(fs.readFileSync('features.json'));
// or
import features from 'features.json';

const App = () => {
    const repository = new StaticFeatureRepository(features);

    return (
        <FeatureProvider repository={repository}>
            <div className='My App is cool'>
                <FeatureToggledComponent />
                <FeatureWithValueComponent />
            </div>
        </FeatureProvider>
    );
};
```

### FeatureAccess Control Repository

Works when a webpage has meta tag with id=“meta-features-json” with a list of tags
FAC only has boolean support so value will be true or false based on if the feature is enabled

```jsx
import {
    FeatureProvider,
    useFeature,
    FeatureAccessControlRepository,
} from '@iot-app-kit/feature-toggles';

const FeatureToggledComponent = () => {
    const [myFeature] = useFeature('EXAMPLE_FEATURE');

    return (
        <div>
            {myFeature.variation === 'C' && <section>This section is control</section>}
            {myFeature.variation === 'T1' && <section>This section is Treatment 1</section>}
        </div>
    );
};

const App = () => {
    const repository = new FeatureAccessControlRepository();

    return (
        <FeatureProvider repository={repository}>
            <div className='My App is cool'>
                <FeatureToggledComponent />
            </div>
        </FeatureProvider>
    );
};
```
