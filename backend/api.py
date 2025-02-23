import requests

PREMIERS = {
    "Alberta": {
        "name": "Danielle Smith",
        "photo": "https://www.alberta.ca/system/files/styles/square_scale_crop/private/premier-danielle-smith-new_0.jpg?itok=7PP0HxJk",
    },
    "British Columbia": {
        "name": "David Eby",
        "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/David_Eby_-_2022_%2852507022370%29_%28cropped%29.png/220px-David_Eby_-_2022_%2852507022370%29_%28cropped%29.png",
    },
    "Manitoba": {
        "name": "Wab Kinew",
        "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Wab_Kinew_in_Sept_2024_%28cropped%29.jpg/1200px-Wab_Kinew_in_Sept_2024_%28cropped%29.jpg",
    },
    "New Brunswick": {
        "name": "Susan Holt",
        "photo": "https://nbliberal.ca/wp-content/uploads/rob_6895-scaled-e1719409147284-1024x943.jpg",
    },
    "Newfoundland and Labrador": {
        "name": "Andrew Furey",
        "photo": "https://nlliberals.ca/site/uploads/2022/12/PM_Visit_GNL_072821-26-1024x683.jpg",
    },
    "Nova Scotia": {
        "name": "Tim Houston",
        "photo": "https://assets.nationbuilder.com/nspcparty/pages/412/features/original/premier_no_bg.jpg?1654532213",
    },
    "Ontario": {
        "name": "Doug Ford",
        "photo": "https://www.ontario.ca/files/2021-08/po-marketing-banner-doug-ford-premier-960x560-2021-08-12.jpg.jpg",
    },
    "Prince Edward Island": {
        "name": "Rob Lantz",
        "photo": "https://www.princeedwardisland.ca/sites/default/files/images/employees/d13_rob_lantz_-_headshot_2023.jpg",
    },
    "Quebec": {
        "name": "François Legault",
        "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUkIj0apXvevxXiap24lplc9TYKRzBzOJ7JA&s",
    },
    "Saskatchewan": {
        "name": "Scott Moe",
        "photo": "https://upload.wikimedia.org/wikipedia/commons/6/60/Scott_Moe_at_US_EPA_%28cropped%29.jpg",
    },
    "Northwest Territories": {
        "name": "R.J. Simpson",
        "photo": "https://www.ntlegislativeassembly.ca/sites/default/files/styles/3_4_portrait_profile/public/legacy/r.j._simpson.jpg?h=eb6658bb&itok=yWbCQf2Q",
    },
    "Yukon": {
        "name": "Ranj Pillai",
        "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS54-DGbx26BpSFSymw4KiqUDxTtRoRoqlxUQ&s",
    },
    "Nunavut": {
        "name": "P.J. Akeeagok",
        "photo": "https://www.premier.gov.nu.ca/sites/default/files/sidebar/pj_akeeagok.jpg",
    },
}


def get_postcode_data(postcode: str) -> tuple[str, str, str, str] | None:
    url = f"https://represent.opennorth.ca/postcodes/{postcode}/"
    mayor_name, mayor_photo = None, None

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json().get("representatives_centroid", [])

        for person in data:
            if person.get("elected_office") == "Mayor":
                mayor_name = f"{person.get('first_name', '')} {person.get('last_name', '')}".strip()
                mayor_photo = person.get("photo_url", None)
                break
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from OpenNorth: {e}")

    url = f"http://api.geonames.org/postalCodeSearchJSON?postalcode={postcode}&country=CA&username=talz_a"  # Replace with your username
    province = None
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json().get("postalCodes", [])
        if data:
            province = data[0].get("adminName1", "Unknown")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from GeoNames: {e}")

    premier = PREMIERS.get(province)
    premier_name = premier["name"]
    premier_photo = premier["photo"]

    if mayor_name and premier_name:
        return mayor_name, mayor_photo, province, premier_name, premier_photo

    return None


if __name__ == "__main__":
    postcode = "L5G4L3"
    result = get_postcode_data(postcode)

    if result:
        mayor_name, mayor_photo, province, premier_name, premier_photo = result
        print(f"Mayor: {mayor_name}\nPhoto: {mayor_photo}")
        print(f"Province: {province}\nPremier: {premier_name}\nPhoto: {premier_photo}")
    else:
        print("No data found or error occurred.")
