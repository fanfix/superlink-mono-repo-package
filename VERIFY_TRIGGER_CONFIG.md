# How to Verify and Fix Cloud Build Trigger Configuration

## ⚠️ The Error You're Seeing

```
unable to prepare context: unable to evaluate symlinks in Dockerfile path: lstat /workspace/Dockerfile: no such file or directory
```

This error means **your trigger is STILL using a default Dockerfile configuration**, NOT the `cloudbuild.yaml` file.

## Step-by-Step Fix (VERY IMPORTANT)

### Step 1: Go to Cloud Build Triggers

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **Cloud Build** → **Triggers** (in the left sidebar)

### Step 2: Identify the Trigger

1. Look at the list of triggers
2. Find the trigger that's running when you push to your repo
3. **Check the "Configuration" column** - it should show:
   - ❌ **WRONG**: "Dockerfile" or "Inline" or "Dockerfile in source"
   - ✅ **CORRECT**: "cloudbuild.yaml" or "Cloud Build configuration file"

### Step 3: Edit the Trigger

1. Click on the trigger name (or click the **three dots** → **Edit**)
2. Scroll down to the **Configuration** section
3. **CRITICAL**: Look at what's currently selected:
   - If you see "Dockerfile" selected → **This is the problem!**
   - If you see "Cloud Build configuration file (yaml or json)" → Check the file path

### Step 4: Fix the Configuration

**If "Dockerfile" is selected:**

1. Click the radio button for **"Cloud Build configuration file (yaml or json)"**
2. In the **Location** field, type exactly: `cloudbuild.yaml`
   - ⚠️ NOT `/cloudbuild.yaml`
   - ⚠️ NOT `./cloudbuild.yaml`
   - ⚠️ NOT `cloudbuild.yml`
   - ✅ Just: `cloudbuild.yaml`
3. **Scroll down and click "SAVE"** (very important!)

### Step 5: Verify the Change

1. After saving, go back to the triggers list
2. Check the **Configuration** column again
3. It should now show: `cloudbuild.yaml` or similar

### Step 6: Test

1. Make a small commit and push to your repository
2. Go to **Cloud Build** → **History**
3. Click on the new build
4. **Check the build steps** - you should see:
   - ✅ "build-admin" step
   - ✅ "build-agency" step  
   - ✅ "build-client" step
   - ❌ NOT just a single "Build" step

## Common Mistakes

### Mistake 1: Not Actually Saving
- You changed the configuration but forgot to click **"Save"**
- **Solution**: Make sure you scroll down and click the Save button

### Mistake 2: Wrong File Path
- You entered `/cloudbuild.yaml` instead of `cloudbuild.yaml`
- **Solution**: Use exactly `cloudbuild.yaml` (no leading slash)

### Mistake 3: Multiple Triggers
- You updated one trigger, but a different trigger is actually running
- **Solution**: Check which trigger is actually being used (check the build history)

### Mistake 4: Configuration Type Not Changed
- You only changed the file path, but the type is still "Dockerfile"
- **Solution**: Make sure you select "Cloud Build configuration file (yaml or json)" radio button

## Alternative: Delete and Recreate the Trigger

If editing doesn't work, delete and recreate:

1. **Delete the old trigger:**
   - Go to Triggers
   - Click three dots → **Delete**
   - Confirm deletion

2. **Create a new trigger:**
   - Click **"Create Trigger"**
   - **Name**: `deploy-all-services`
   - **Event**: Push to a branch
   - **Source**: Select your repository
   - **Branch**: `.*` (or your specific branch)
   - **Configuration**: 
     - ✅ Select **"Cloud Build configuration file (yaml or json)"**
     - **Location**: `cloudbuild.yaml`
   - **Service account**: Leave default
   - Click **"Create"**

## Verify Which Trigger is Running

1. Go to **Cloud Build** → **History**
2. Click on a failed build
3. Look at the build details - it should show which trigger started it
4. Make sure you're editing THAT trigger

## Still Not Working?

If you've followed all steps and it's still not working:

1. **Take a screenshot** of your trigger configuration page
2. **Check the build logs** - what does the first step say?
3. **Verify the file exists**: Make sure `cloudbuild.yaml` is committed to your repository
4. **Check the branch**: Make sure the trigger is watching the branch you're pushing to

## Quick Test

To verify the trigger is using cloudbuild.yaml, look at the build logs. If you see:
- ✅ Multiple steps with IDs like "build-admin", "build-agency", "build-client" → **Working!**
- ❌ Single step called "Build" → **Still using Dockerfile configuration**

