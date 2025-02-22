import requests


def get_postcode_data(postcode: str) -> tuple[str, str, str] | None:
    url = f"https://represent.opennorth.ca/postcodes/{postcode}/"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json().get("representatives_centroid", [])

        for person in data:
            if person.get("elected_office") == "Mayor":
                return (
                    person.get("first_name"),
                    person.get("last_name"),
                    person.get("photo_url"),
                )

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")

    return None


if __name__ == "__main__":
    postcode = "L5G4L3"
    result = get_postcode_data(postcode)

    if result:
        first_name, last_name, photo_url = result
        print(f"Mayor: {first_name} {last_name}\nPhoto: {photo_url}")
    else:
        print("No Mayor found or error occurred.")
