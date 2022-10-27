//
//  ViewActivitiesViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/21/22.
//

import UIKit
import CoreData

class ViewActivitiesViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    var activities: [Activity] = []
    var context: NSManagedObjectContext?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
        context = appDelegate.persistentContainer.viewContext
        getActivities()
    }
    
    func getActivities() {
        let request = NSFetchRequest<Activity>(entityName: "Activity")
        let argArray = [ Variables.user.id ]
        request.predicate = NSPredicate(format: "userId = %@", argumentArray: argArray)
        request.sortDescriptors = [NSSortDescriptor(key: "startDate", ascending: false)]
        do {
            activities = try context!.fetch(request)
        }
        catch let error as NSError {
            print(error)
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return activities.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "viewActivitiesTableViewCell", for: indexPath) as! ViewActivitesTableViewCell
        let currentActivity = activities[indexPath.row]
        cell.ActivityLabel.text = "\(currentActivity.name!) \(Date().dateToString(date: currentActivity.startDate!, format: "MM-dd-yyyy"))"
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let activity = activities[indexPath.row]
        alertToUpload(activity: activity)
    }
    
    func alertToUpload(activity: Activity) {
        let alert = UIAlertController(title: "Upload \(activity.name!)?", message: nil, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Upload", style: .default, handler: { action in
            Task {
                await HttpService.createActivity(activity: activity)
                self.deleteActivity(activity: activity)
                self.getActivities()
                self.tableView.reloadData()
            }
        }))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        self.present(alert,animated: true)
    }
    
    func deleteActivity(activity: Activity) {
        context!.delete(activity)
        do {
            try context!.save()
        }
        catch let error as NSError {
            print(error)
        }
    }
}

extension Date {
    public func dateToString(date: Date, format: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = format
        return formatter.string(from: date)
    }
    
    public func stringToDate(dateStr: String, format: String) -> Date {
        let formatter = DateFormatter()
        formatter.dateFormat = format
        return formatter.date(from: dateStr)!
    }
}
