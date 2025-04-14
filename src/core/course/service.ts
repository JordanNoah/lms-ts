import { Op } from "sequelize";
import CategoryCourseDto from "./dto/category.dto";
import { CategoryCourseModel } from "./model/category.course.model";
import { CourseModel } from "./model/course.model";
import CourseDto from "./dto/course.dto";

export default class CourseCoreService {
    public async registerOrUpdateCourse(courseDto: CourseDto): Promise<CourseModel> {
        try {
            const [courseDb, create] = await CourseModel.findOrCreate({
                where: {
                    [Op.or]: [
                        { shortName: courseDto.shortName },
                        { idNumber: courseDto.idNumber }
                    ]
                },
                defaults: {
                    name: courseDto.name,
                    sectionId: courseDto.sectionId,
                    shortName: courseDto.shortName,
                    description: courseDto.description,
                    idNumber: courseDto.idNumber
                }
            })

            if (!create) {
                courseDb.name = courseDto.name;
                courseDb.sectionId = courseDto.sectionId;
                courseDb.shortName = courseDto.shortName;
                courseDb.description = courseDto.description;
                courseDb.idNumber = courseDto.idNumber;
                await courseDb.save();
            }
            
            return courseDb;
        } catch (error) {
            throw new Error(`Error registering or updating course: ${error}`);
        }
    }

    public async createUpdateCategory(categoryDto: CategoryCourseDto): Promise<CategoryCourseModel> {
        try {
            const [categoryDb, create] = await CategoryCourseModel.findOrCreate({
                where: {
                    [Op.or]: [
                        { name: categoryDto.name }
                    ]
                },
                defaults: {
                    name: categoryDto.name,
                    description: categoryDto.description,
                    idNumber: categoryDto.idNumber
                }
            });

            if (!create) {
                categoryDb.name = categoryDto.name;
                categoryDb.description = categoryDto.description;
                categoryDb.idNumber = categoryDto.idNumber;
                await categoryDb.save();
            }

            return categoryDb;
        } catch (error) {
            console.log(error);
            
            throw new Error(`Error creating or updating category: ${error}`);
        }
    }
}