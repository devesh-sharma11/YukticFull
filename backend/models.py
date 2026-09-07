from pydantic import BaseModel, EmailStr

from typing import List

from typing import Optional
from datetime import datetime



class Feedback(BaseModel):
    data: dict


class Testimonial(BaseModel):
    feedbackId: Optional[str] = None

    name: str

    designation: str
    
    avatar: str = ""

    rating: int

    testimonial: str

    published: bool = False
    
    featured: bool = False
    

class ResultItem(BaseModel):
    icon: str
    text: str


class StatItem(BaseModel):
    number: str
    label: str


class ProjectSummary(BaseModel):
    organisation: str
    region: str
    service_types: List[str]
    stakeholders: Optional[str] = ""
    epic_modules: List[str]
    specialties: str
    landmark: str


class CaseStudyImage(BaseModel):
    image: str
    caption: str = ""
    

class ImageLibraryItem(BaseModel):
    original_name: str
    filename: str
    path: str
    size: int
    uploaded_at: datetime
    uploaded_by: str
    usage_count: int = 0
    used_in: list = []
    used_by: List[str] = []
    
class CaseStudy(BaseModel):

    # Hero
    title: str
    subtitle: str
    landmark_banner: str

    # Background
    backgrounds: List[str]
    
    # Case Study Images

    architecture_image: Optional[CaseStudyImage] = None

    workflow_image: Optional[CaseStudyImage] = None

    product_image: Optional[CaseStudyImage] = None
    
        
    event_types: List[str]
    
    difficult_factors: List[str] = []

    # Challenge
    challenges: List[str]

    # What was done
    intervention_intro: str

    steps: List[str]
    
    # My Role
    my_role_intro: Optional[str] = ""
    my_role_points: List[str] = []

    # Results
    results: List[ResultItem]

    # Green Stats Box
    stats: List[StatItem]

    # Trophy Box
    landmark_title: str
    landmark_description: str
    
    #Client say
    client_said: Optional[str] = ""

    # Sidebar
    project_summary: ProjectSummary

    # Routing
    slug: str
    
    #filter
    filter_title: str

    # Publish
    published: bool = False
    
    # Featured
    featured: bool = False
    
    


class ContactEnquiry(BaseModel):
    firstName: str
    lastName: str
    jobTitle: Optional[str] = ""
    organisation: str

    email: EmailStr
    phone: Optional[str] = ""

    contactMethod: Optional[str] = ""

    orgType: Optional[str] = ""
    orgSize: Optional[str] = ""

    service: str
    stage: Optional[str] = ""
    timescale: Optional[str] = ""
    platform: Optional[str] = ""
    source: Optional[str] = ""
    
    
   
    buttonSource: Optional[str] = "Contact Page"
    


    overview: str
    additional: Optional[str] = ""

    submittedAt: Optional[datetime] = None
    
    
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str


class ResetAdminPasswordRequest(BaseModel):
    newPassword: str
    
    
class FeedbackRequestEmail(BaseModel):
    email: EmailStr
    subject: str
    message: str



class Job(BaseModel):
    # Basic Details
    title: str
    location: str
    work_mode: List[str]
    job_type: str

    # Recruiters
    recruiter_ids: List[str] = []

    # Skills
    mandatory_skills: List[str]
    optional_skills: List[str] = []

    # Experience
    min_experience: Optional[float] = None
    max_experience: Optional[float] = None

    # Package
    min_package: Optional[float] = None
    max_package: Optional[float] = None

    # Notice Period
    min_notice_period: Optional[int] = None
    max_notice_period: Optional[int] = None

    # Description
    description: str

    # Routing
    slug: str

    # Publishing
    published: bool = False
    publishedAt: Optional[datetime] = None

    # Metadata
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    createdBy: Optional[str] = None
    updatedBy: Optional[str] = None