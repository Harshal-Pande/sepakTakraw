
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** sepaknew
- **Date:** 2025-10-13
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** Player Registration Successful Completion
- **Test Code:** [TC001_Player_Registration_Successful_Completion.py](./TC001_Player_Registration_Successful_Completion.py)
- **Test Error:** The player registration flow cannot be completed because the system fails to generate a unique reference number at step 1. The error message 'Failed to generate reference number' is shown after submitting valid details. Further testing is stopped and the issue is reported for resolution.
Browser Console Logs:
[WARNING] Image with src "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1920&auto=format&fit=crop" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.
Read more: https://nextjs.org/docs/api-reference/next/image#priority (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/player-registration/step1:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/844b5048-6e5b-40d4-b6d2-e838b3df22d1
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Player Registration Validation Errors
- **Test Code:** [TC002_Player_Registration_Validation_Errors.py](./TC002_Player_Registration_Validation_Errors.py)
- **Test Error:** Validation errors are not triggered on player registration step 1 when submitting empty or malformed inputs. The form submission navigates away without error messages, indicating a critical validation issue. Stopping further testing until this is fixed.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[WARNING] Image with src "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1920&auto=format&fit=crop" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.
Read more: https://nextjs.org/docs/api-reference/next/image#priority (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: net::ERR_INSUFFICIENT_RESOURCES (at http://localhost:3000/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1571019613454-1cb2f99b2d8b%3Fw%3D1200%26h%3D600%26fit%3Dcrop&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/99f75a57-4f45-4e88-bc02-88e6919434cc
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Admin Login and Authentication
- **Test Code:** [TC003_Admin_Login_and_Authentication.py](./TC003_Admin_Login_and_Authentication.py)
- **Test Error:** The admin login page or admin routes are not accessible. Clicking the GOVERNANCE link leads to a 404 error page. Unable to verify admin login functionality or access restrictions. The issue has been reported and testing is stopped as per instructions.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance?_rsc=vusbg:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/e0af7560-12fa-4739-992f-c633472a3e34
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Admin Dashboard CRUD Operations on News
- **Test Code:** [TC004_Admin_Dashboard_CRUD_Operations_on_News.py](./TC004_Admin_Dashboard_CRUD_Operations_on_News.py)
- **Test Error:** Admin login or dashboard page is not accessible from the homepage. The site redirects to an unrelated sports federation homepage (Sepaktakraw Sports Federation) instead of the expected admin interface. This blocks the ability to perform CRUD operations on news items as required by the task. Further testing cannot proceed without admin access.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/4bc2c53b-f175-4f59-9893-27e2dd8633d2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Events Public Listing and Registration
- **Test Code:** [TC005_Events_Public_Listing_and_Registration.py](./TC005_Events_Public_Listing_and_Registration.py)
- **Test Error:** The events listing and event detail pages display event information correctly, including date, location, description, and media. However, the event registration form is not present on any event detail page tested, including 'Event B' and 'pande ji ki shadi'. This prevents testing of event registration functionality and validation. The absence of the registration form is a critical issue that blocks completion of the registration testing steps.
Browser Console Logs:
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/a47e52fc-b7d7-48d4-a349-c63de49dcaa3
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Admin Event CRUD with Media Upload
- **Test Code:** [TC006_Admin_Event_CRUD_with_Media_Upload.py](./TC006_Admin_Event_CRUD_with_Media_Upload.py)
- **Test Error:** Admin login failed due to invalid credentials, preventing access to event management page. Unable to proceed with testing CRUD operations on events and media uploads. Task stopped.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:3000/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[WARNING] The resource http://localhost:3000/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally. (at http://localhost:3000/:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[WARNING] The resource http://localhost:3000/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally. (at http://localhost:3000/:0:0)
[WARNING] The resource http://localhost:3000/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally. (at http://localhost:3000/:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[WARNING] The resource http://localhost:3000/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally. (at http://localhost:3000/:0:0)
[WARNING] The resource http://localhost:3000/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally. (at http://localhost:3000/general-body:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/verify:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/verify:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/verify:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/dc91a08a-bab1-4049-b816-e717080165e6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Elections Management CRUD by Admin
- **Test Code:** [TC007_Elections_Management_CRUD_by_Admin.py](./TC007_Elections_Management_CRUD_by_Admin.py)
- **Test Error:** Reported missing election management controls on the elections page. Cannot proceed with testing creation, editing, viewing, and deletion of elections due to lack of UI elements. Stopping further testing.
Browser Console Logs:
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/fafd06c1-bda6-47b9-8b18-1ea2fe9cfd8e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Anti-Doping Guidelines Public View and Admin Management
- **Test Code:** [TC008_Anti_Doping_Guidelines_Public_View_and_Admin_Management.py](./TC008_Anti_Doping_Guidelines_Public_View_and_Admin_Management.py)
- **Test Error:** Document viewer functionality on the anti-doping guidelines public page is broken. Clicking document viewer buttons does not open or display the documents. Further testing of public document viewing and admin CRUD operations cannot proceed until this issue is fixed.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/67468ac9-e6fa-4cee-b593-82e0c9f01170
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** History and General Body Content Management
- **Test Code:** [TC009_History_and_General_Body_Content_Management.py](./TC009_History_and_General_Body_Content_Management.py)
- **Test Error:** Admin login failed due to invalid credentials, preventing access to the admin dashboard. Therefore, it is not possible to verify if the static content sections for history and general body are editable by admins, served via API, and render correctly on public pages. The task cannot be completed as specified due to lack of admin access.
Browser Console Logs:
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance?_rsc=bnp6d:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/527d3638-c29b-4d01-8b93-874823cca34d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Hero Images and File Manager Upload and Display
- **Test Code:** [TC010_Hero_Images_and_File_Manager_Upload_and_Display.py](./TC010_Hero_Images_and_File_Manager_Upload_and_Display.py)
- **Test Error:** Unable to proceed with the task because the provided admin credentials are invalid, preventing access to the admin dashboard and hero image management. Please provide valid admin login credentials to continue testing the upload, browse, and management of hero images and files.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[WARNING] Image with src "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1920&auto=format&fit=crop" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.
Read more: https://nextjs.org/docs/api-reference/next/image#priority (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/verify:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/verify:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/verify:0:0)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/login:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/1dcf5c7b-3530-453b-9bed-412fd5fd63c0
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Results and Statistics Display and Admin Input
- **Test Code:** [TC011_Results_and_Statistics_Display_and_Admin_Input.py](./TC011_Results_and_Statistics_Display_and_Admin_Input.py)
- **Test Error:** The public results and statistics page was verified to display data correctly. However, the admin login page or link is not accessible from the public site, preventing testing of admin input and update capabilities. This is a critical issue that needs resolution to complete the task.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/cbf79efc-0036-496e-8f58-ab11f18d318e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** Site-wide Search and Quick Links Functionality
- **Test Code:** [TC012_Site_wide_Search_and_Quick_Links_Functionality.py](./TC012_Site_wide_Search_and_Quick_Links_Functionality.py)
- **Test Error:** Testing stopped due to missing site-wide search functionality and broken navigation links leading to 404 errors. The site content is inconsistent and does not allow verification of search results or quick links. Please fix these critical issues before retesting.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance?_rsc=vusbg:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/49aa6c26-6825-4d96-9e0c-aaab2f6515e1
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Responsive Design Across Devices
- **Test Code:** [TC013_Responsive_Design_Across_Devices.py](./TC013_Responsive_Design_Across_Devices.py)
- **Test Error:** The website layout, components, and navigation have been verified on desktop screen size with no broken UI elements. The navigation menu and content are accessible and visually intact. However, the steps to resize the window to tablet size and reload, as well as testing on mobile device or emulator, were not performed. Therefore, the task is only partially complete with desktop responsiveness confirmed but tablet and mobile responsiveness not yet verified.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/467b5861-aee2-4539-8904-42938ebefffa
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** Navigation Links and URL Verification
- **Test Code:** [TC014_Navigation_Links_and_URL_Verification.py](./TC014_Navigation_Links_and_URL_Verification.py)
- **Test Error:** Navigation link validation stopped due to multiple broken links causing navigation failures and 404 errors. Detailed issue reported for developer action.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance?_rsc=vusbg:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/bef1b4ce-1fda-4291-9dd6-423064159f40
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Form Input Validation Across Site
- **Test Code:** [TC015_Form_Input_Validation_Across_Site.py](./TC015_Form_Input_Validation_Across_Site.py)
- **Test Error:** Testing of forms on the site is incomplete due to several issues: The player registration form allows submission with empty inputs without showing validation errors, indicating missing or improper validation. The event registration form could not be located despite navigation and search attempts. The admin forms are inaccessible as the GOVERNANCE link leads to a 404 error page. These issues prevent full validation testing of all forms on the site.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance?_rsc=bnp6d:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/a1491ae2-5404-48c7-9e0f-7cf5c510e79f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** No Broken Links, Images or JS Console Errors
- **Test Code:** [TC016_No_Broken_Links_Images_or_JS_Console_Errors.py](./TC016_No_Broken_Links_Images_or_JS_Console_Errors.py)
- **Test Error:** Testing stopped due to critical broken link on 'GOVERNANCE' page resulting in 404 error. No further navigation performed. Please fix the broken link to continue testing.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FAFC.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[WARNING] Image with src "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1920&auto=format&fit=crop" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.
Read more: https://nextjs.org/docs/api-reference/next/image#priority (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrNirmalMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIstar.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FGujju.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FDrRakshaHMMungra.jpg&w=96&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance?_rsc=vusbg:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) (at http://localhost:3000/governance:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFootballSportsDevelopment.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FPerformatxActivewear.jpg&w=128&q=75:0:0)
[WARNING] Image with src "/logos/sepak.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes (at http://localhost:3000/_next/static/chunks/41c91_next_dist_c786c50f._.js:968:20)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FNivia.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FIndiGo.jpg&w=128&q=75:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/_next/image?url=%2Flogos%2FFIFA.jpg&w=128&q=75:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b70806e7-8975-4ab8-a1c5-cd6e73248d3a/d54ebf58-0099-415e-bcee-7a12e2ee582d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---