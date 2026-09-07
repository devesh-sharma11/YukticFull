import os
from bson import ObjectId

from database import image_library


UPLOAD_FOLDER = "uploads/case-studies"


def get_image_by_id(image_id: str):
    try:
        return image_library.find_one(
            {"_id": ObjectId(image_id)}
        )
    except:
        return None


def get_image_by_filename(filename: str):
    return image_library.find_one(
        {"filename": filename}
    )


def increase_usage(image_id: str, case_study_slug: str):

    print("\n===== increase_usage =====")

    image = get_image_by_id(image_id)

    print("Image:", image)

    if not image:
        print("Image not found")
        return

    used_by = image.get("used_by", [])

    print("Before:", used_by)

    if case_study_slug not in used_by:

        used_by.append(case_study_slug)

        print("After:", used_by)

        result = image_library.update_one(
            {"_id": ObjectId(image_id)},
            {
                "$set": {
                    "used_by": used_by,
                    "usage_count": len(used_by)
                }
            }
        )

        print("Matched:", result.matched_count)
        print("Modified:", result.modified_count)

        updated = image_library.find_one(
            {"_id": ObjectId(image_id)}
        )

        print("Updated Doc:", updated)


def decrease_usage(image_id: str, case_study_slug: str):

    image = get_image_by_id(image_id)

    if not image:
        return

    used_by = image.get("used_by", [])

    if case_study_slug in used_by:

        used_by.remove(case_study_slug)

        image_library.update_one(
            {
                "_id": ObjectId(image_id)
            },
            {
                "$set": {
                    "used_by": used_by,
                    "usage_count": len(used_by)
                }
            }
        )


def can_delete_image(image_id: str):

    image = get_image_by_id(image_id)

    if not image:
        return False

    return image.get("usage_count", 0) == 0


def delete_image(image_id: str):

    image = get_image_by_id(image_id)

    if not image:
        return False

    filepath = os.path.join(
        UPLOAD_FOLDER,
        image["filename"]
    )

    if os.path.exists(filepath):
        os.remove(filepath)

    image_library.delete_one(
        {"_id": ObjectId(image_id)}
    )

    return True


def list_all_images():

    images = []

    for image in image_library.find().sort("uploaded_at", -1):

        image["_id"] = str(image["_id"])

        images.append(image)

    return images